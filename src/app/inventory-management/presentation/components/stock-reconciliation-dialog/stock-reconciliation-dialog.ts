import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { IamStore } from '../../../../iam/application/iam.store';
import { WarehouseStore } from '../../../../warehouse-management/application/warehouse.store';
import { InventoryStore } from '../../../application/inventory.store';

/** Data passed by product, dashboard, or traceability reconciliation actions. */
export interface StockReconciliationDialogData {
  productId?: number | string;
  warehouseId?: number | string;
}

/** Dialog for comparing digital stock with a physical count. */
@Component({
  selector: 'app-stock-reconciliation-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    TranslatePipe
  ],
  templateUrl: './stock-reconciliation-dialog.html',
  styleUrl: './stock-reconciliation-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockReconciliationDialog implements OnInit {
  protected readonly data = inject<StockReconciliationDialogData>(MAT_DIALOG_DATA);
  protected readonly inventoryStore = inject(InventoryStore);
  protected readonly warehouseStore = inject(WarehouseStore);
  protected readonly iamStore = inject(IamStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<StockReconciliationDialog>);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  protected readonly canReconcile = computed(() =>
    this.iamStore.hasRole('ROLE_ADMINISTRATOR') || this.iamStore.hasRole('ROLE_SECURITY_MANAGER')
  );
  protected readonly errorMessage = computed(() => this.inventoryStore.error());
  protected readonly Number = Number;
  protected readonly selectedProductId = signal(
    this.data.productId === undefined ? '0' : String(this.data.productId)
  );
  protected readonly countedStockValue = signal(0);
  protected readonly form = this.formBuilder.nonNullable.group({
    productId: [this.data.productId === undefined ? 0 : Number(this.data.productId), Validators.min(1)],
    warehouseId: [this.data.warehouseId === undefined ? 0 : Number(this.data.warehouseId), Validators.min(1)],
    countedStock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    justification: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]]
  });

  protected readonly selectedProduct = computed(() => {
    const productId = this.selectedProductId();
    return this.inventoryStore.products().find(
      (product) => String(product.id) === String(productId)
    ) ?? null;
  });

  protected readonly stockDifference = computed(() =>
    Number(this.countedStockValue() || 0) - (this.selectedProduct()?.currentStock ?? 0)
  );

  ngOnInit(): void {
    this.inventoryStore.loadProducts();
    this.warehouseStore.loadWarehouses();
    this.iamStore.resolveCurrentUserContext().subscribe((user) => {
      if (!this.data.warehouseId && user?.warehouseId) {
        this.form.controls.warehouseId.setValue(Number(user.warehouseId));
      }
      if (!this.canReconcile()) {
        this.snackBar.open(this.translate.instant('inventory.errors.unauthorized'), undefined, {
          duration: 4000
        });
      }
    });
  }

  protected selectProduct(productId: number): void {
    this.form.controls.productId.setValue(Number(productId));
    this.selectedProductId.set(String(productId));
    this.setCountedStock(this.selectedProduct()?.currentStock ?? 0);
  }

  protected setCountedStock(value: number): void {
    this.form.controls.countedStock.setValue(value);
    this.countedStockValue.set(value);
  }

  protected signedDifference(): string {
    const difference = this.stockDifference();
    return `${difference > 0 ? '+' : ''}${difference}`;
  }

  protected close(): void {
    this.dialogRef.close();
  }

  protected submit(): void {
    if (!this.canReconcile()) {
      return;
    }
    if (this.form.invalid || !this.selectedProduct()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.inventoryStore.reconcile(
      value.productId,
      value.warehouseId,
      value.countedStock,
      value.justification
    ).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error: Error) => {
        this.snackBar.open(this.translate.instant(error.message), undefined, { duration: 4500 });
      }
    });
  }
}
