import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api.endpoint';
import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { SubscriptionPlanResponse } from './subscription.response';
import { SubscriptionPlanAssembler } from './subscription-plan.assembler';
import { environment } from '../../../environments/environment';

const subscriptionPlansResourceEndpointPath = '/subscription-plans';

/** API endpoint for the SubscriptionPlan aggregate. */
@Injectable({ providedIn: 'root' })
export class SubscriptionPlansApiEndpoint extends BaseApiEndpoint<
  SubscriptionPlan,
  SubscriptionPlanResponse,
  SubscriptionPlanAssembler
> {
  constructor() {
    super(
      inject(HttpClient),
      `${environment.serverBaseUrl}${subscriptionPlansResourceEndpointPath}`,
      new SubscriptionPlanAssembler()
    );
  }
}
