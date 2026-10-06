/** Common auditing attributes exposed by aggregates that keep an immutable trail. */
export interface AuditTrail {
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}
