
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

import { LanguageService } from '../../../../shared/infrastructure/language.service';
import { IamStore } from '../../../../iam/application/iam.store';
import { ReportingStore } from '../../../application/reporting.store';
import { StockReconciliationDialog } from '../../../../inventory-management/presentation/components/stock-reconciliation-dialog/stock-reconciliation-dialog';

@Component({
  selector: 'app-traceability-detail',
  standalone: true,
  imports: [DatePipe, TranslatePipe],
  templateUrl: './traceability-detail.html',
  styleUrl: './traceability-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraceabilityDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  /** Gives the DatePipe the locale of the selected language. */
  protected readonly language = inject(LanguageService);

  protected readonly reportingStore = inject(ReportingStore);
  protected readonly iamStore = inject(IamStore);
  protected readonly eventId = signal<string | null>(null);
  protected readonly actionMessage = signal('');
  protected readonly loadingDetail = signal(true);
  protected readonly canReconcile = computed(() =>
    this.iamStore.hasRole('ROLE_ADMINISTRATOR') || this.iamStore.hasRole('ROLE_SECURITY_MANAGER')
  );

  protected readonly record = computed(() => {
    const id = this.eventId();

    if (id === null) {
      return undefined;
    }

    return this.reportingStore.records().find(
      item => String(item.id) === id
    );
  });

  protected readonly isDiscrepancy = computed(() => {
    const type = this.record()?.recordType.toUpperCase() ?? '';
    return type.includes('DISCREPANCY');
  });

  protected readonly isInventoryMovement = computed(() => {
    const type = this.record()?.recordType.toUpperCase() ?? '';
    return type.includes('INVENTORY_MOVEMENT');
  });

  ngOnInit(): void {
    this.eventId.set(this.route.snapshot.paramMap.get('id'));

    this.reportingStore.loadRecords();
    this.iamStore.resolveCurrentUserContext().subscribe();

    // Espera a que el store publique los registros.
    // El estado definitivo se comprueba al renderizar la vista.
    this.loadingDetail.set(false);
  }

  protected goBack(): void {
    this.router.navigate(['/traceability']);
  }

  protected justifyDiscrepancy(): void {
    const event = this.record();
    if (!event || !this.canReconcile()) {
      return;
    }

    this.dialog.open(StockReconciliationDialog, {
      width: 'min(520px, calc(100vw - 32px))',
      data: { warehouseId: event.warehouseId }
    });
  }

  protected reportShrinkage(): void {
    this.actionMessage.set('traceability.detail.messages.shrinkageNotSaved');
  }
}
