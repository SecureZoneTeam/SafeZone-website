import { BaseResponse } from '../../shared/infrastructure/base-response';

/** Resource exposed for the SubscriptionPlan aggregate. */
export interface SubscriptionPlanResponse extends BaseResponse {
  name: string;
  code: string;
  monthlyPrice: number;
  currency: string;
  warehouseLimit: number;
  sensorNodeLimit: number;
  userLimit: number;
}

/** Resource exposed for the Subscription aggregate. */
export interface SubscriptionResponse extends BaseResponse {
  companyId: number | string;
  planId: number | string;
  status: string;
  startedAt: string;
  renewsAt: string | null;
}
