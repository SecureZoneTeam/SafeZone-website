import { Injectable, computed, inject, signal } from '@angular/core';

import {
  TraceabilityRecord,
  TraceabilityRecordType
} from '../domain/model/traceability-record.entity';
import { TraceabilityRecordsApiEndpoint } from '../infrastructure/traceability-records-api.endpoint';

/** Application state management for the Reporting bounded context. */
@Injectable({ providedIn: 'root' })
export class ReportingStore {
  private readonly traceabilityRecordsApi = inject(TraceabilityRecordsApiEndpoint);

  private readonly recordsSignal = signal<TraceabilityRecord[]>([]);
  private readonly discrepanciesOnlySignal = signal(false);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly discrepanciesOnly = this.discrepanciesOnlySignal.asReadonly();

  /** Searching system: filter by record type (user story US10). */
  readonly records = computed(() =>
    this.discrepanciesOnlySignal()
      ? this.recordsSignal().filter(
          (record) => record.recordType === TraceabilityRecordType.Discrepancy
        )
      : this.recordsSignal()
  );

  loadRecords(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.traceabilityRecordsApi.getAll().subscribe({
      next: (records) => {
        this.recordsSignal.set(records);
        this.loadingSignal.set(false);
      },
      error: (error: Error) => {
        this.errorSignal.set(error.message);
        this.loadingSignal.set(false);
      }
    });
  }

  toggleDiscrepanciesOnly(value: boolean): void {
    this.discrepanciesOnlySignal.set(value);
  }
}
