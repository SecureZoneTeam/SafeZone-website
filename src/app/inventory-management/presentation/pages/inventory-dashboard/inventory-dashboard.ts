import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../../iam/application/iam.store';
import { InventoryStore } from '../../../application/inventory.store';
import { StockMovement } from '../../../domain/model/stock-movement.entity';
import { StockReconciliationDialog } from '../../components/stock-reconciliation-dialog/stock-reconciliation-dialog';

/** Inventory overview with stock KPIs and recent activity. */
@Component({
  selector: 'app-inventory-dashboard',
  imports: [RouterLink, MatIconModule, MatProgressBarModule, TranslatePipe, DatePipe],
  templateUrl: './inventory-dashboard.html',
  styleUrl: './inventory-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryDashboard implements OnInit {
  protected readonly inventoryStore = inject(InventoryStore);
  protected readonly iamStore = inject(IamStore);
  private readonly dialog = inject(MatDialog);

  protected readonly todayMovementCount = computed(() => {
    const today = new Date().toDateString();
    return this.inventoryStore.movements().filter(
      (movement) => movement.occurredAt.toDateString() === today
    ).length;
  });

  ngOnInit(): void {
    this.inventoryStore.loadProducts();
    this.inventoryStore.loadMovements();
    this.iamStore.resolveCurrentUserContext().subscribe();
  }

  protected canWrite(role: string): boolean {
    return this.iamStore.hasRole(role);
  }

  protected productName(productId: number | string): string {
    return this.inventoryStore.products().find(
      (product) => String(product.id) === String(productId)
    )?.name ?? '';
  }

  protected barWidth(units: number): number {
    const maxUnits = Math.max(
      1,
      ...this.inventoryStore.topRotationProducts().map((item) => item.unitsDispatched)
    );
    return Math.max(6, (units / maxUnits) * 100);
  }

  protected openReconciliation(productId?: number | string): void {
    this.dialog.open(StockReconciliationDialog, {
      width: 'min(520px, calc(100vw - 32px))',
      data: {
        productId,
        warehouseId: this.iamStore.currentWarehouseId() ?? undefined
      }
    });
  }

  protected trackMovement(_index: number, movement: StockMovement): number | string {
    return movement.id;
  }
}
