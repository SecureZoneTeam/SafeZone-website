import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

import { InventoryStore } from '../../../application/inventory.store';
import { Product, ProductCategory } from '../../../domain/model/product.entity';
import { Sku } from '../../../domain/model/sku';

/** Product create/edit form; stock is maintained by movement workflows only. */
@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    TranslatePipe
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inventoryStore = inject(InventoryStore);

  protected readonly isEditMode = signal(false);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly categories = Object.values(ProductCategory);
  private productId: string | null = null;
  protected readonly originalProduct = signal<Product | null>(null);

  private readonly skuValidator: ValidatorFn = (control): ValidationErrors | null =>
    Sku.isValid(String(control.value ?? '')) ? null : { skuInvalid: true };

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    sku: ['', [Validators.required, this.skuValidator]],
    category: [ProductCategory.Networking, Validators.required],
    unit: ['UNIT', [Validators.required, Validators.maxLength(20)]]
  });

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(this.productId !== null);

    if (this.productId === null) {
      return;
    }

    this.loading.set(true);
    this.inventoryStore.getProductById(this.productId).subscribe({
      next: (product) => {
        this.originalProduct.set(product);
        this.form.patchValue({
          name: product.name,
          sku: product.sku.value,
          category: product.category,
          unit: product.unit
        });
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('inventory.errors.productNotFound');
        this.loading.set(false);
      }
    });
  }

  protected submit(): void {
    this.errorMessage.set('');
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const existingProduct = this.originalProduct();
    let product: Product;
    try {
      product = new Product({
        id: existingProduct?.id,
        companyId: existingProduct?.companyId ?? 1,
        name: value.name.trim(),
        sku: new Sku(value.sku),
        category: value.category,
        unit: value.unit.trim(),
        currentStock: existingProduct?.currentStock ?? 0,
        createdAt: existingProduct?.createdAt,
        createdBy: existingProduct?.createdBy
      });
    } catch {
      this.form.controls.sku.setErrors({ skuInvalid: true });
      return;
    }

    this.saving.set(true);
    const request = existingProduct
      ? this.inventoryStore.updateProduct(existingProduct.id, product)
      : this.inventoryStore.createProduct(product);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/inventory/products']);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message || 'inventory.errors.savePending');
        this.saving.set(false);
      }
    });
  }
}
