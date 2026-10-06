import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api.endpoint';
import { SecurityAlert } from '../domain/model/security-alert.entity';
import { SecurityAlertResponse } from './security-alert.response';
import { SecurityAlertAssembler } from './security-alert.assembler';
import { environment } from '../../../environments/environment';

const securityAlertsResourceEndpointPath = '/security-alerts';

/** API endpoint for the SecurityAlert aggregate. */
@Injectable({ providedIn: 'root' })
export class SecurityAlertsApiEndpoint extends BaseApiEndpoint<
  SecurityAlert,
  SecurityAlertResponse,
  SecurityAlertAssembler
> {
  constructor() {
    super(
      inject(HttpClient),
      `${environment.serverBaseUrl}${securityAlertsResourceEndpointPath}`,
      new SecurityAlertAssembler()
    );
  }
}
