import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { IamStore } from '../../iam/application/iam.store';
import { Product } from '../domain/model/product.entity';
import { StockMovement, StockMovementType } from '../domain/model/stock-movement.entity';
import { ProductsApiEndpoint } from '../infrastructure/products-api.endpoint';
import { StockMovementsApiEndpoint } from '../infrastructure/stock-movements-api.endpoint';

const rotationWindowDays = 30;

/** Application state and domain operations for the Inventory Management bounded context. */
@Injectable({ providedIn: 'root' })
export class InventoryStore {
  private readonly productsApi = inject(ProductsApiEndpoint);
  private readonly movementsApi = inject(StockMovementsApiEndpoint);
  private readonly iamStore = inject(IamStore);

  private readonly productsSignal = signal<Product[]>([]);
  private readonly movementsSignal = signal<StockMovement[]>([]);
  private readonly loadingCountSignal = signal(0);
  private readonly errorSignal = signal<string | null>(null);

  readonly products = this.productsSignal.asReadonly();
  readonly movements = this.movementsSignal.asReadonly();
  readonly loading = computed(() => this.loadingCountSignal() > 0);
  readonly error = this.errorSignal.asReadonly();
  readonly totalUnits = computed(() =>
    this.productsSignal().reduce((total, product) => total + product.currentStock, 0)
  );
  readonly productCount = computed(() => this.productsSignal().length);
  readonly outOfStockProducts = computed(() =>
    this.productsSignal().filter((product) => product.isOutOfStock)
  );
  readonly recentMovements = computed(() =>
    [...this.movementsSignal()]
      .sort((first, second) => second.occurredAt.getTime() - first.occurredAt.getTime())
      .slice(0, 10)
  );
  readonly lastReconciliations = computed(() =>
    this.movementsSignal()
      .filter((movement) => movement.type === StockMovementType.Reconciliation)
      .sort((first, second) => second.occurredAt.getTime() - first.occurredAt.getTime())
      .slice(0, 5)
  );
  readonly topRotationProducts = computed(() => {
    const cutoff = Date.now() - rotationWindowDays * 24 * 60 * 60 * 1000;
    const exitsByProduct = new Map<string, number>();

    for (const movement of this.movementsSignal()) {
      if (
        movement.type === StockMovementType.Exit &&
        movement.occurredAt.getTime() >= cutoff
      ) {
        const productId = String(movement.productId);
        exitsByProduct.set(productId, (exitsByProduct.get(productId) ?? 0) + movement.quantity);
      }
    }

    return this.productsSignal()
      .map((product) => ({
        product,
        unitsDispatched: exitsByProduct.get(String(product.id)) ?? 0
      }))
      .filter((item) => item.unitsDispatched > 0)
      .sort((first, second) => second.unitsDispatched - first.unitsDispatched)
      .slice(0, 5);
  });

  loadProducts(): void {
    this.loadingCountSignal.update((count) => count + 1);
    this.errorSignal.set(null);
    this.productsApi.getAll().subscribe({
      next: (products) => {
        this.productsSignal.set(products);
        this.finishLoading();
      },
      error: () => {
        this.errorSignal.set('inventory.errors.loadProducts');
        this.finishLoading();
      }
    });
  }

  loadMovements(): void {
    this.loadingCountSignal.update((count) => count + 1);
    this.errorSignal.set(null);
    this.movementsApi.getAll().subscribe({
      next: (movements) => {
        this.movementsSignal.set(movements);
        this.finishLoading();
      },
      error: () => {
        this.errorSignal.set('inventory.errors.loadMovements');
        this.finishLoading();
      }
    });
  }

  getProductById(id: number | string): Observable<Product> {
    return this.productsApi.getById(id);
  }

  createProduct(product: Product): Observable<Product> {
    if (this.productsSignal().some((item) => item.sku.value === product.sku.value)) {
      return throwError(() => new Error('inventory.errors.duplicateSku'));
    }

    // Deferred until the backend contract is defined; no product is created locally.
    // return this.productsApi.create(product);
    return this.pendingWriteError<Product>();
  }

  updateProduct(id: number | string, product: Product): Observable<Product> {
    const duplicateSku = this.productsSignal().some(
      (item) => String(item.id) !== String(id) && item.sku.value === product.sku.value
    );
    if (duplicateSku) {
      return throwError(() => new Error('inventory.errors.duplicateSku'));
    }

    // Deferred until the backend contract is defined; no product is updated locally.
    // return this.productsApi.update(id, product);
    void id;
    return this.pendingWriteError<Product>();
  }

  registerEntry(productId: number, warehouseId: number, quantity: number): Observable<StockMovement> {
    return this.registerMovement(productId, warehouseId, quantity, StockMovementType.Entry);
  }

  registerExit(productId: number, warehouseId: number, quantity: number): Observable<StockMovement> {
    return this.registerMovement(productId, warehouseId, quantity, StockMovementType.Exit);
  }

  reconcile(
    productId: number,
    warehouseId: number,
    countedStock: number,
    justification: string
  ): Observable<StockMovement> {
    if (!Number.isInteger(countedStock) || countedStock < 0) {
      return throwError(() => new Error('inventory.validation.countedStockInvalid'));
    }
    if (!Number.isInteger(warehouseId) || warehouseId <= 0) {
      return throwError(() => new Error('inventory.validation.warehouseRequired'));
    }

    const normalizedJustification = justification.trim();
    if (normalizedJustification.length < 10 || normalizedJustification.length > 300) {
      return throwError(() => new Error('inventory.validation.justificationInvalid'));
    }

    const product = this.findProduct(productId);
    if (!product) {
      return throwError(() => new Error('inventory.errors.productNotFound'));
    }
    if (!this.iamStore.currentUser()?.username) {
      return throwError(() => new Error('inventory.errors.sessionRequired'));
    }

    const movement = this.buildMovement(
      product,
      warehouseId,
      StockMovementType.Reconciliation,
      countedStock,
      countedStock,
      normalizedJustification
    );

    return this.deferMovement(movement);
  }

  private registerMovement(
    productId: number,
    warehouseId: number,
    quantity: number,
    type: StockMovementType.Entry | StockMovementType.Exit
  ): Observable<StockMovement> {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return throwError(() => new Error('inventory.validation.quantityInvalid'));
    }
    if (!Number.isInteger(warehouseId) || warehouseId <= 0) {
      return throwError(() => new Error('inventory.validation.warehouseRequired'));
    }

    const product = this.findProduct(productId);
    if (!product) {
      return throwError(() => new Error('inventory.errors.productNotFound'));
    }
    if (!this.iamStore.currentUser()?.username) {
      return throwError(() => new Error('inventory.errors.sessionRequired'));
    }
    if (type === StockMovementType.Exit && !product.canDispatch(quantity)) {
      return throwError(() => new Error('inventory.errors.insufficientStock'));
    }

    const previousStock = product.currentStock;
    const resultingStock = type === StockMovementType.Entry
      ? previousStock + quantity
      : previousStock - quantity;
    return this.deferMovement(
      this.buildMovement(product, warehouseId, type, quantity, resultingStock, null, previousStock)
    );
  }

  private buildMovement(
    product: Product,
    warehouseId: number,
    type: StockMovementType,
    quantity: number,
    resultingStock: number,
    justification: string | null,
    previousStock = product.currentStock
  ): StockMovement {
    return new StockMovement({
      productId: product.id,
      warehouseId,
      type,
      quantity,
      previousStock,
      resultingStock,
      performedBy: this.iamStore.currentUser()!.username,
      occurredAt: new Date(),
      justification
    });
  }

  private deferMovement(movement: StockMovement): Observable<StockMovement> {
    // Deferred until the backend contract is defined; movement history and stock stay unchanged.
    // return this.movementsApi.create(movement);
    void movement;
    return this.pendingWriteError<StockMovement>();
  }

  private findProduct(productId: number): Product | undefined {
    return this.productsSignal().find((product) => String(product.id) === String(productId));
  }

  private pendingWriteError<T>(): Observable<T> {
    return throwError(() => new Error('shared.errors.resourceWritePending'));
  }

  private finishLoading(): void {
    this.loadingCountSignal.update((count) => Math.max(0, count - 1));
  }
}
