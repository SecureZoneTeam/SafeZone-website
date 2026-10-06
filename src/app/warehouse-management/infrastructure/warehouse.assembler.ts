import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { StreetAddress } from '../domain/model/street-address';
import { Warehouse, WarehouseStatus } from '../domain/model/warehouse.entity';
import { WarehouseResponse } from './warehouse.response';

/** Translates Warehouse resources into Warehouse entities and the other way around. */
export class WarehouseAssembler implements BaseAssembler<Warehouse, WarehouseResponse> {
  toEntityFromResource(resource: WarehouseResponse): Warehouse {
    return new Warehouse({
      id: resource.id,
      companyId: resource.companyId,
      name: resource.name,
      address: new StreetAddress(resource.street, resource.district, resource.city, resource.country),
      status: resource.status as WarehouseStatus,
      zoneCount: resource.zoneCount
    });
  }

  toEntitiesFromResponse(response: WarehouseResponse[]): Warehouse[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toResourceFromEntity(entity: Warehouse): WarehouseResponse {
    return {
      id: entity.id,
      companyId: entity.companyId,
      name: entity.name,
      street: entity.address.street,
      district: entity.address.district,
      city: entity.address.city,
      country: entity.address.country,
      status: entity.status,
      zoneCount: entity.zoneCount
    };
  }
}
