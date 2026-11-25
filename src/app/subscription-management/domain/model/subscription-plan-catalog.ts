import { Money } from './money';
import { SubscriptionPlan } from './subscription-plan.entity';

/**
 * Plan catalog. The backend has no plan endpoint (only /api/v1/subscriptions for the
 * organization's own subscriptions), so the catalog lives in the frontend.
 */
export const SUBSCRIPTION_PLAN_CATALOG: readonly SubscriptionPlan[] = [
  new SubscriptionPlan({ id: 1, name: 'Básico', code: 'BASIC', monthlyPrice: new Money(49, 'USD'),
    warehouseLimit: 1, sensorNodeLimit: 5, userLimit: 3 }),
  new SubscriptionPlan({ id: 2, name: 'Premium', code: 'PREMIUM', monthlyPrice: new Money(129, 'USD'),
    warehouseLimit: 5, sensorNodeLimit: 30, userLimit: 15 }),
  new SubscriptionPlan({ id: 3, name: 'Corporativo', code: 'CORPORATE', monthlyPrice: new Money(349, 'USD'),
    warehouseLimit: 25, sensorNodeLimit: 200, userLimit: 100 })
];
