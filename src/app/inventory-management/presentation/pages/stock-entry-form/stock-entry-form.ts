import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

import { WarehouseStore } from '../../../../warehouse-management/application/warehouse.store';
import { InventoryStore } from '../../../application/inventory.store';
import { Product } from '../../../domain/model/product.entity';

/** Reactive stock-entry workflow with a pre-submit stock summary. */
@Component({
  selector: 'app-stock-entry-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    TranslatePipe
  ],
  templateUrl: './stock-entry-form.html',
  styleUrl: './stock-entry-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockEntryForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly inventoryStore = inject(InventoryStore);
  protected readonly warehouseStore = inject(WarehouseStore);
  protected readonly errorMessage = signal('');
  protected readonly productSearch = signal('');
  protected readonly selectedProductId = signal('0');
  protected readonly quantityValue = signal(1);
  protected readonly Number = Number;

  protected readonly form = this.formBuilder.nonNullable.group({
    warehouseId: [0, [Validators.required, Validators.min(1)]],
    productId: [0, [Validators.required, Validators.min(1)]],
    quantity: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]]
  });

  protected readonly filteredProducts = computed(() => {
    const query = this.productSearch().trim().toLowerCase();
    return this.inventoryStore.products().filter((product) =>
      !query || product.name.toLowerCase().includes(query) || product.sku.value.toLowerCase().includes(query)
    );
  });

  protected readonly selectedProduct = computed(() =>
    this.inventoryStore.products().find(
      (product) => String(product.id) === this.selectedProductId()
    ) ?? null
  );

  protected readonly resultingStock = computed(() =>
    (this.selectedProduct()?.currentStock ?? 0) + this.quantityValue()
  );

  ngOnInit(): void {
    this.inventoryStore.loadProducts();
    this.warehouseStore.loadWarehouses();
  }

  protected selectProduct(event: MatAutocompleteSelectedEvent): void {
    const product = event.option.value as Product;
    this.form.controls.productId.setValue(Number(product.id));
    this.selectedProductId.set(String(product.id));
    this.productSearch.set(`${product.name} · ${product.sku.value}`);
  }

  protected updateProductSearch(value: string): void {
    this.productSearch.set(value);
    this.form.controls.productId.setValue(0);
    this.selectedProductId.set('0');
  }

  protected updateQuantity(value: number): void {
    this.form.controls.quantity.setValue(Number(value));
    this.quantityValue.set(Number(value) || 0);
  }

  protected displayProduct(product: Product): string {
    return `${product.name} · ${product.sku.value}`;
  }

  protected submit(): void {
    this.errorMessage.set('');
    if (this.form.invalid || !this.selectedProduct()) {
      this.form.markAllAsTouched();
      return;
    }

    const { productId, warehouseId, quantity } = this.form.getRawValue();
    this.inventoryStore.registerEntry(productId, warehouseId, Number(quantity)).subscribe({
      next: () => {
        this.form.controls.quantity.setValue(1);
        this.quantityValue.set(1);
        this.productSearch.set('');
        this.form.controls.productId.setValue(0);
        this.selectedProductId.set('0');
      },
      error: (error: Error) => this.errorMessage.set(error.message)
    });
  }
}
