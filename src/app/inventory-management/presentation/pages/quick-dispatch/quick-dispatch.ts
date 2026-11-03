import { ChangeDetectionStrategy, Component, ElementRef, OnInit, AfterViewInit, ViewChild, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../../iam/application/iam.store';
import { WarehouseStore } from '../../../../warehouse-management/application/warehouse.store';
import { InventoryStore } from '../../../application/inventory.store';
import { Product } from '../../../domain/model/product.entity';

/** Mobile-first product selection and dispatch screen. */
@Component({
  selector: 'app-quick-dispatch',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatInputModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './quick-dispatch.html',
  styleUrl: './quick-dispatch.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickDispatch implements OnInit, AfterViewInit {
  protected readonly inventoryStore = inject(InventoryStore);
  protected readonly warehouseStore = inject(WarehouseStore);
  protected readonly iamStore = inject(IamStore);
  protected readonly searchTerm = signal('');
  protected readonly selectedProduct = signal<Product | null>(null);
  protected readonly quantity = signal(1);
  protected readonly errorMessage = signal('');
  @ViewChild('productSearchInput') private searchInput?: ElementRef<HTMLInputElement>;

  protected readonly selectedWarehouseId = computed(() =>
    this.iamStore.currentWarehouseId() ?? Number(this.warehouseStore.warehouses()[0]?.id ?? 0)
  );
  protected readonly filteredProducts = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    return this.inventoryStore.products()
      .filter((product) => !query || product.name.toLowerCase().includes(query) || product.sku.value.toLowerCase().includes(query))
      .slice(0, 8);
  });
  protected readonly canConfirm = computed(() => {
    const product = this.selectedProduct();
    return Boolean(product && this.selectedWarehouseId() > 0 && product.canDispatch(this.quantity()));
  });

  ngOnInit(): void {
    this.inventoryStore.loadProducts();
    this.warehouseStore.loadWarehouses();
    this.iamStore.resolveCurrentUserContext().subscribe();
  }

  ngAfterViewInit(): void {
    this.searchInput?.nativeElement.focus();
  }

  protected updateSearch(value: string): void {
    this.searchTerm.set(value);
    this.selectedProduct.set(null);
    this.quantity.set(1);
    this.errorMessage.set('');
  }

  protected chooseProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.searchTerm.set(`${product.name} · ${product.sku.value}`);
    this.quantity.set(1);
    this.errorMessage.set('');
  }

  protected increment(): void {
    const product = this.selectedProduct();
    if (product && product.canDispatch(this.quantity() + 1)) {
      this.quantity.update((quantity) => quantity + 1);
    }
  }

  protected decrement(): void {
    this.quantity.update((quantity) => Math.max(1, quantity - 1));
  }

  protected confirmDispatch(): void {
    const product = this.selectedProduct();
    if (!product || !this.canConfirm()) {
      return;
    }

    this.errorMessage.set('');
    this.inventoryStore.registerExit(
      Number(product.id),
      this.selectedWarehouseId(),
      this.quantity()
    ).subscribe({
      next: () => {
        this.selectedProduct.set(null);
        this.searchTerm.set('');
        this.quantity.set(1);
      },
      error: (error: Error) => this.errorMessage.set(error.message)
    });
  }
}
