
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReportingStore } from '../../../application/reporting.store';

@Component({
  selector: 'app-traceability-detail',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './traceability-detail.html',
  styleUrl: './traceability-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraceabilityDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly reportingStore = inject(ReportingStore);
  protected readonly eventId = signal<string | null>(null);
  protected readonly actionMessage = signal('');
  protected readonly justification = signal('');
  protected readonly loadingDetail = signal(true);

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

    // Espera a que el store publique los registros.
    // El estado definitivo se comprueba al renderizar la vista.
    this.loadingDetail.set(false);
  }

  protected goBack(): void {
    this.router.navigate(['/traceability']);
  }

  protected onJustificationChange(value: string): void {
    this.justification.set(value);
  }

  protected justifyDiscrepancy(): void {
    if (!this.justification().trim()) {
      this.actionMessage.set(
        'Escribe una justificación antes de continuar.'
      );
      return;
    }

    this.actionMessage.set(
      'La justificación está preparada, pero todavía no se guarda en el servidor.'
    );
  }

  protected reportShrinkage(): void {
    this.actionMessage.set(
      'El reporte de merma requiere integrar un endpoint para guardar el incidente.'
    );
  }
}
