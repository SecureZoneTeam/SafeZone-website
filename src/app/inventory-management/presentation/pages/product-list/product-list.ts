import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../../iam/application/iam.store';
import { InventoryStore } from '../../../application/inventory.store';
import { Product, ProductCategory } from '../../../domain/model/product.entity';
import { StockReconciliationDialog } from '../../components/stock-reconciliation-dialog/stock-reconciliation-dialog';

/** Filterable product catalog with role-aware inventory actions. */
@Component({
  selector: 'app-product-list',
  imports: [
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    TranslatePipe
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductList implements OnInit {
  protected readonly inventoryStore = inject(InventoryStore);
  protected readonly iamStore = inject(IamStore);
  protected readonly categories = Object.values(ProductCategory);
  protected readonly searchTerm = signal('');
  protected readonly categoryFilter = signal('ALL');
  protected readonly displayedColumns = ['product', 'sku', 'category', 'stock', 'unit', 'actions'];
  private readonly dialog = inject(MatDialog);

  protected readonly filteredProducts = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const category = this.categoryFilter();
    return this.inventoryStore.products().filter((product) => {
      const matchesQuery = !query || product.name.toLowerCase().includes(query) ||
        product.sku.value.toLowerCase().includes(query);
      const matchesCategory = category === 'ALL' || product.category === category;
      return matchesQuery && matchesCategory;
    });
  });

  ngOnInit(): void {
    this.inventoryStore.loadProducts();
    this.iamStore.resolveCurrentUserContext().subscribe();
  }

  protected updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  protected updateCategory(value: string): void {
    this.categoryFilter.set(value);
  }

  protected canReconcile(): boolean {
    return this.iamStore.hasRole('ROLE_ADMINISTRATOR') ||
      this.iamStore.hasRole('ROLE_SECURITY_MANAGER');
  }

  protected openReconciliation(product: Product): void {
    this.dialog.open(StockReconciliationDialog, {
      width: 'min(520px, calc(100vw - 32px))',
      data: { productId: product.id, warehouseId: this.iamStore.currentWarehouseId() ?? undefined }
    });
  }

  protected categoryKey(category: ProductCategory): string {
    return `inventory.categories.${category}`;
  }
}
