import { BaseEntity } from '../../../shared/domain/model/base-entity';

/** Company aggregate root of the Company Registration bounded context. */
export class Company implements BaseEntity {
  id: number | string;
  legalName: string;
  taxId: string;
  contactEmail: string;
  country: string;
  subscriptionId: number | string | null;

  constructor(company: {
    id?: number | string;
    legalName?: string;
    taxId?: string;
    contactEmail?: string;
    country?: string;
    subscriptionId?: number | string | null;
  }) {
    this.id = company.id ?? 0;
    this.legalName = company.legalName ?? '';
    this.taxId = company.taxId ?? '';
    this.contactEmail = company.contactEmail ?? '';
    this.country = company.country ?? 'PE';
    this.subscriptionId = company.subscriptionId ?? null;
  }
}
