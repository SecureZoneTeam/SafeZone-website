import { BaseResponse } from '../../shared/infrastructure/base-response';

/** Resource exposed by the NodeSecure RESTful API for the Company aggregate. */
export interface CompanyResponse extends BaseResponse {
  legalName: string;
  taxId: string;
  contactEmail: string;
  country: string;
  subscriptionId: number | string | null;
}
