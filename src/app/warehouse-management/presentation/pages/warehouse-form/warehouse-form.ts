import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

import { WarehouseStore } from '../../../application/warehouse.store';
import { Warehouse } from '../../../domain/model/warehouse.entity';
import { StreetAddress } from '../../../domain/model/street-address';
import {finalize} from "rxjs";


@Component({
  selector: 'app-warehouse-form',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, TranslatePipe],
  templateUrl: './warehouse-form.html',
  styleUrl: './warehouse-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly warehouseStore = inject(WarehouseStore);
protected submitError='';

  protected submitting=false;
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    street: ['', [Validators.required]],
    district: ['', [Validators.required]],
    city: ['Lima', [Validators.required]],
    country: ['PE', [Validators.required, Validators.maxLength(2)]]
  });

  protected submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();

      const warehouse =new Warehouse({
        companyId: 1,
        name: value.name.trim(),
        address: new StreetAddress(value.street.trim(), value.district.trim(), value.city.trim(), value.country.trim())
      });
      this.submitError='';
      this.submitting = true;
      this.warehouseStore.createWarehouse(warehouse)
      .pipe(finalize(() => {
        this.submitting = false;
      }))
    .subscribe({
      next: () => {
        void this.router.navigate(['/warehouses']);
      },
      error: (error: Error) =>{
        this.submitError =
          error.message || 'No se pudo registrar el almacén.';

        console.error('Error al crear el alamacén', error);
      }
    });
  }
}
