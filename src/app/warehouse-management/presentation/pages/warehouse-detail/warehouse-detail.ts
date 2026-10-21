import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { WarehouseStore } from '../../../application/warehouse.store';
import { Warehouse } from '../../../domain/model/warehouse.entity';

@Component({
  selector: 'app-warehouse-detail',
  imports: [RouterLink],
  templateUrl: './warehouse-detail.html',
  styleUrl: './warehouse-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly warehouseStore = inject(WarehouseStore);

  protected readonly warehouse = signal<Warehouse | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id === null) {
      this.error.set('No se especificó el almacén.');
      this.loading.set(false);
      return;
    }

    this.warehouseStore.getWarehouseById(id).subscribe({
      next: (warehouse) => {
        this.warehouse.set(warehouse);
        this.loading.set(false);
      },
      error: (error: Error) => {
        this.error.set(error.message || 'No se pudo cargar el almacén.');
        this.loading.set(false);
      }
    });
  }
}
