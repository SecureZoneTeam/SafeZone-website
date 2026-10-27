
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';

import { ReportingStore } from '../../../application/reporting.store';

@Component({
  selector: 'app-traceability-log',
  imports: [DatePipe, MatProgressBarModule],
  templateUrl: './traceability-log.html',
  styleUrl: './traceability-log.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraceabilityLog implements OnInit {
  protected readonly reportingStore = inject(ReportingStore);
  private readonly router = inject(Router);

  protected readonly searchText = signal('');
  protected readonly selectedTypes = signal<string[]>([]);
  protected readonly dateRange = signal('0');
  protected readonly menuRecord = signal<any | null>(null);

  protected readonly eventTypes = [
    { value: 'PHYSICAL_ACCESS', label: 'Acceso físico' },
    { value: 'NODE_DISCONNECTION', label: 'Desconexión de sensor' },
    { value: 'INVENTORY_MOVEMENT', label: 'Movimiento de inventario' },
    { value: 'DISCREPANCY', label: 'Discrepancia física' }
  ];

  protected readonly filteredRecords = computed(() => {
    const records = this.reportingStore.records();
    const search = this.searchText().trim().toLowerCase();
    const types = this.selectedTypes();
    const days = Number(this.dateRange());
    const now = new Date();

    return records.filter(record => {
      const matchesSearch =
        !search ||
        record.description.toLowerCase().includes(search) ||
        record.actor.toLowerCase().includes(search) ||
        record.recordType.toLowerCase().includes(search);

      const matchesType =
        types.length === 0 || types.includes(record.recordType);

      const occurredAt = new Date(record.occurredAt).getTime();
      const matchesDate =
        !days ||
        (
          !Number.isNaN(occurredAt) &&
          occurredAt >= now.getTime() - days * 24 * 60 * 60 * 1000 &&
          occurredAt <= now.getTime()
        );

      return matchesSearch && matchesType && matchesDate;
    });
  });

  ngOnInit(): void {
    this.reportingStore.loadRecords();
  }

  protected toggleType(type: string, checked: boolean): void {
    this.selectedTypes.update(current =>
      checked
        ? [...current, type]
        : current.filter(item => item !== type)
    );
  }

  protected isTypeSelected(type: string): boolean {
    return this.selectedTypes().includes(type);
  }

  protected clearFilters(): void {
    this.searchText.set('');
    this.selectedTypes.set([]);
    this.dateRange.set('7');
  }

  protected openEvent(record: any): void {
    this.menuRecord.set(null);
    this.router.navigate(['/traceability', record.id]);
  }

  protected toggleEventMenu(record: any): void {
    this.menuRecord.update(current =>
      current?.id === record.id ? null : record
    );
  }
}
