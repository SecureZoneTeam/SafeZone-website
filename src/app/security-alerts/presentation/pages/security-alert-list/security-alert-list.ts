import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { SecurityAlertStore } from '../../../application/security-alert.store';
import { AlertSeverity, SecurityAlert } from '../../../domain/model/security-alert.entity';

/** Security alert list with the false-alarm reconciliation action (user stories US03 and US07). */
@Component({
  selector: 'app-security-alert-list',
  imports: [DatePipe, MatTableModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './security-alert-list.html',
  styleUrl: './security-alert-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityAlertList implements OnInit {
  protected readonly securityAlertStore = inject(SecurityAlertStore);
  protected readonly displayedColumns = [
    'severity',
    'alertType',
    'message',
    'raisedAt',
    'status',
    'actions'
  ];

  ngOnInit(): void {
    this.securityAlertStore.loadAlerts();
  }

  protected severityClass(alert: SecurityAlert): string {
    switch (alert.severity) {
      case AlertSeverity.Critical:
        return 'ns-severity--critical';
      case AlertSeverity.Major:
        return 'ns-severity--major';
      default:
        return 'ns-severity--minor';
    }
  }

  protected reconcile(alert: SecurityAlert): void {
    this.securityAlertStore.reconcileAlert({
      alertId: alert.id,
      justification: 'Movimiento de stock autorizado verbalmente por el supervisor.'
    });
  }
}
