import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Money } from './money';

/** SubscriptionPlan aggregate root (user story US15). */
export class SubscriptionPlan implements BaseEntity {
  id: number | string;
  name: string;
  code: string;
  monthlyPrice: Money;
  warehouseLimit: number;
  sensorNodeLimit: number;
  userLimit: number;

  constructor(plan: {
    id?: number | string;
    name?: string;
    code?: string;
    monthlyPrice?: Money;
    warehouseLimit?: number;
    sensorNodeLimit?: number;
    userLimit?: number;
  }) {
    this.id = plan.id ?? 0;
    this.name = plan.name ?? '';
    this.code = plan.code ?? '';
    this.monthlyPrice = plan.monthlyPrice ?? new Money();
    this.warehouseLimit = plan.warehouseLimit ?? 0;
    this.sensorNodeLimit = plan.sensorNodeLimit ?? 0;
    this.userLimit = plan.userLimit ?? 0;
  }
}
