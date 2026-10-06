import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { ReportingStore } from '../../../application/reporting.store';

/** Immutable traceability log with filters (user stories US08 and US10). */
@Component({
  selector: 'app-traceability-log',
  imports: [
    DatePipe,
    MatTableModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    TranslatePipe
  ],
  templateUrl: './traceability-log.html',
  styleUrl: './traceability-log.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraceabilityLog implements OnInit {
  protected readonly reportingStore = inject(ReportingStore);
  protected readonly displayedColumns = ['occurredAt', 'recordType', 'actor', 'description'];

  ngOnInit(): void {
    this.reportingStore.loadRecords();
  }
}
