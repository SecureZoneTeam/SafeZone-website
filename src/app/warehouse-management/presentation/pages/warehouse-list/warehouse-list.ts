import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { WarehouseStore } from '../../../application/warehouse.store';

/** Warehouse list view (user story US01). */
@Component({
  selector: 'app-warehouse-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    TranslatePipe
  ],
  templateUrl: './warehouse-list.html',
  styleUrl: './warehouse-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseList implements OnInit {
  protected readonly warehouseStore = inject(WarehouseStore);
  protected readonly displayedColumns = ['name', 'district', 'zones', 'status', 'actions'];

  ngOnInit(): void {
    this.warehouseStore.loadWarehouses();
  }
}
