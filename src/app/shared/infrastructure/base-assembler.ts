import { BaseEntity } from '../domain/model/base-entity';
import { BaseResponse } from './base-response';

/**
 * Contract for assemblers translating between API resources and domain entities.
 * Keeping the translation out of the services preserves the bounded context boundaries.
 */
export interface BaseAssembler<TEntity extends BaseEntity, TResource extends BaseResponse> {
  toEntityFromResource(resource: TResource): TEntity;
  toEntitiesFromResponse(response: TResource[]): TEntity[];
  toResourceFromEntity(entity: TEntity): TResource;
}
