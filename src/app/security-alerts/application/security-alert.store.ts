import { Injectable, computed, inject, signal } from '@angular/core';

import { AlertStatus, SecurityAlert } from '../domain/model/security-alert.entity';
import { ReconcileAlertCommand } from '../domain/model/reconcile-alert.command';
import { SecurityAlertsApiEndpoint } from '../infrastructure/security-alerts-api.endpoint';

/** Application state management for the Security Alerts bounded context. */
@Injectable({ providedIn: 'root' })
export class SecurityAlertStore {
  private readonly securityAlertsApi = inject(SecurityAlertsApiEndpoint);

  private readonly alertsSignal = signal<SecurityAlert[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly alerts = this.alertsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly openAlerts = computed(() => this.alertsSignal().filter((alert) => alert.isOpen));

  loadAlerts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.securityAlertsApi.getAll().subscribe({
      next: (alerts) => {
        this.alertsSignal.set(alerts);
        this.loadingSignal.set(false);
      },
      error: (error: Error) => {
        this.errorSignal.set(error.message);
        this.loadingSignal.set(false);
      }
    });
  }

  reconcileAlert(command: ReconcileAlertCommand): void {
    const alert = this.alertsSignal().find((item) => item.id === command.alertId);
    if (!alert) {
      return;
    }

    const reconciled = new SecurityAlert({
      ...alert,
      status: AlertStatus.FalseAlarm,
      justification: command.justification
    });

    this.securityAlertsApi.update(alert.id, reconciled).subscribe({
      next: (updated) =>
        this.alertsSignal.update((current) =>
          current.map((item) => (item.id === updated.id ? updated : item))
        ),
      error: (error: Error) => this.errorSignal.set(error.message)
    });
  }
}
