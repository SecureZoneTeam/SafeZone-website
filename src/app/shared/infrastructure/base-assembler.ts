import { BaseEntity } from '../domain/model/base-entity';
import { BaseResponse } from './base-response';


export interface BaseAssembler<TEntity extends BaseEntity, TResource extends BaseResponse> {
  toEntityFromResource(resource: TResource): TEntity;
  toEntitiesFromResponse(response: TResource[]): TEntity[];
  toResourceFromEntity(entity: TEntity): TResource;
}
