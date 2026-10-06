import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api.endpoint';
import { TraceabilityRecord } from '../domain/model/traceability-record.entity';
import { TraceabilityRecordResponse } from './traceability-record.response';
import { TraceabilityRecordAssembler } from './traceability-record.assembler';
import { environment } from '../../../environments/environment';

const traceabilityRecordsResourceEndpointPath = '/traceability-records';

/** API endpoint for the TraceabilityRecord aggregate. */
@Injectable({ providedIn: 'root' })
export class TraceabilityRecordsApiEndpoint extends BaseApiEndpoint<
  TraceabilityRecord,
  TraceabilityRecordResponse,
  TraceabilityRecordAssembler
> {
  constructor() {
    super(
      inject(HttpClient),
      `${environment.serverBaseUrl}${traceabilityRecordsResourceEndpointPath}`,
      new TraceabilityRecordAssembler()
    );
  }
}
