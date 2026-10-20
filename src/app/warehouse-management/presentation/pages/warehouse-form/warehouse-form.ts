
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';

import { WarehouseStore } from '../../../application/warehouse.store';
import { Warehouse } from '../../../domain/model/warehouse.entity';
import { StreetAddress } from '../../../domain/model/street-address';

@Component({
  selector: 'app-warehouse-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe
  ],
  templateUrl: './warehouse-form.html',
  styleUrl: './warehouse-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly warehouseStore = inject(WarehouseStore);

  protected warehouseId: number | string | null = null;
  protected isEditMode = false;
  protected submitError = '';
  protected submitting = false;

  private currentWarehouse: Warehouse | null = null;

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    street: ['', [Validators.required]],
    district: ['', [Validators.required]],
    city: ['Lima', [Validators.required]],
    country: ['PE', [Validators.required, Validators.maxLength(2)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id === null) {
      return;
    }

    this.isEditMode = true;
    this.warehouseId = id;
    this.submitting = true;
    this.submitError = '';

    this.warehouseStore.getWarehouseById(id)
      .pipe(finalize(() => {
        this.submitting = false;
      }))
      .subscribe({
        next: (warehouse) => {
          this.currentWarehouse = warehouse;

          this.form.patchValue({
            name: warehouse.name,
            street: warehouse.address.street,
            district: warehouse.address.district,
            city: warehouse.address.city,
            country: warehouse.address.country
          });
        },
        error: (error: Error) => {
          this.submitError =
            error.message || 'No se pudo cargar el almacén.';

          console.error('Error al cargar el almacén:', error);
        }
      });
  }

  protected submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode &&
      (!this.currentWarehouse || this.warehouseId === null)) {
      this.submitError = 'No se pudo cargar el almacén que deseas editar.';
      return;
    }

    const value = this.form.getRawValue();

    const warehouse = new Warehouse({
      id: this.currentWarehouse?.id,
      companyId: this.currentWarehouse?.companyId ?? 1,
      name: value.name.trim(),
      address: new StreetAddress(
        value.street.trim(),
        value.district.trim(),
        value.city.trim(),
        value.country.trim().toUpperCase()
      ),
      status: this.currentWarehouse?.status,
      zoneCount: this.currentWarehouse?.zoneCount
    });

    this.submitError = '';
    this.submitting = true;

    const request = this.isEditMode
      ? this.warehouseStore.updateWarehouse(
        this.warehouseId!,
        warehouse
      )
      : this.warehouseStore.createWarehouse(warehouse);

    request
      .pipe(finalize(() => {
        this.submitting = false;
      }))
      .subscribe({
        next: () => {
          void this.router.navigate(['/warehouses']);
        },
        error: (error: Error) => {
          this.submitError =
            error.message || 'No se pudo guardar el almacén.';

          console.error('Error al guardar el almacén:', error);
        }
      });
  }
}
