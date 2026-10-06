/** Command issued when an operations manager justifies an alert as a false alarm. */
export interface ReconcileAlertCommand {
  alertId: number | string;
  justification: string;
}
