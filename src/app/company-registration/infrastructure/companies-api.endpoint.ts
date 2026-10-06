import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api.endpoint';
import { Company } from '../domain/model/company.entity';
import { CompanyResponse } from './company.response';
import { CompanyAssembler } from './company.assembler';
import { environment } from '../../../environments/environment';

const companiesResourceEndpointPath = '/companies';

/** API endpoint for the Company aggregate. */
@Injectable({ providedIn: 'root' })
export class CompaniesApiEndpoint extends BaseApiEndpoint<
  Company,
  CompanyResponse,
  CompanyAssembler
> {
  constructor() {
    super(
      inject(HttpClient),
      `${environment.serverBaseUrl}${companiesResourceEndpointPath}`,
      new CompanyAssembler()
    );
  }
}
