import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

import { WarehouseStore } from '../../../application/warehouse.store';
import { Warehouse } from '../../../domain/model/warehouse.entity';
import { StreetAddress } from '../../../domain/model/street-address';
import {LanguageSwitcher} from "../../../../shared/presentation/components/language-switcher/language-switcher";


@Component({
  selector: 'app-warehouse-form',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, TranslatePipe, LanguageSwitcher],
  templateUrl: './warehouse-form.html',
  styleUrl: './warehouse-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly warehouseStore = inject(WarehouseStore);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    street: ['', [Validators.required]],
    district: ['', [Validators.required]],
    city: ['Lima', [Validators.required]],
    country: ['PE', [Validators.required, Validators.maxLength(2)]]
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.warehouseStore.createWarehouse(
      new Warehouse({
        companyId: 1,
        name: value.name,
        address: new StreetAddress(value.street, value.district, value.city, value.country)
      })
    );
    void this.router.navigate(['/warehouses']);
  }
}
