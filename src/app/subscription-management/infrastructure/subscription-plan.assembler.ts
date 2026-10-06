import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Money } from '../domain/model/money';
import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { SubscriptionPlanResponse } from './subscription.response';

/** Translates SubscriptionPlan resources into SubscriptionPlan entities. */
export class SubscriptionPlanAssembler
  implements BaseAssembler<SubscriptionPlan, SubscriptionPlanResponse>
{
  toEntityFromResource(resource: SubscriptionPlanResponse): SubscriptionPlan {
    return new SubscriptionPlan({
      id: resource.id,
      name: resource.name,
      code: resource.code,
      monthlyPrice: new Money(resource.monthlyPrice, resource.currency),
      warehouseLimit: resource.warehouseLimit,
      sensorNodeLimit: resource.sensorNodeLimit,
      userLimit: resource.userLimit
    });
  }

  toEntitiesFromResponse(response: SubscriptionPlanResponse[]): SubscriptionPlan[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toResourceFromEntity(entity: SubscriptionPlan): SubscriptionPlanResponse {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      monthlyPrice: entity.monthlyPrice.amount,
      currency: entity.monthlyPrice.currency,
      warehouseLimit: entity.warehouseLimit,
      sensorNodeLimit: entity.sensorNodeLimit,
      userLimit: entity.userLimit
    };
  }
}
