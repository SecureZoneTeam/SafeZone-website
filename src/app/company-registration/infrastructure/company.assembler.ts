import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Company } from '../domain/model/company.entity';
import { CompanyResponse } from './company.response';

/** Translates Company resources into Company entities. */
export class CompanyAssembler implements BaseAssembler<Company, CompanyResponse> {
  toEntityFromResource(resource: CompanyResponse): Company {
    return new Company({
      id: resource.id,
      legalName: resource.legalName,
      taxId: resource.taxId,
      contactEmail: resource.contactEmail,
      country: resource.country,
      subscriptionId: resource.subscriptionId
    });
  }

  toEntitiesFromResponse(response: CompanyResponse[]): Company[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toResourceFromEntity(entity: Company): CompanyResponse {
    return {
      id: entity.id,
      legalName: entity.legalName,
      taxId: entity.taxId,
      contactEmail: entity.contactEmail,
      country: entity.country,
      subscriptionId: entity.subscriptionId
    };
  }
}
