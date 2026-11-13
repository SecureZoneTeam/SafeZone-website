import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Product, ProductCategory } from '../domain/model/product.entity';
import { Sku } from '../domain/model/sku';
import { ProductResponse } from './product.response';

/** Translates Product resources into inventory domain entities. */
export class ProductAssembler implements BaseAssembler<Product, ProductResponse> {
  toEntityFromResource(resource: ProductResponse): Product {
    return new Product({
      id: resource.id,
      companyId: resource.companyId,
      name: resource.name,
      sku: new Sku(resource.sku),
      category: resource.category as ProductCategory,
      unit: resource.unit,
      currentStock: resource.currentStock,
      createdAt: resource.createdAt ? new Date(resource.createdAt) : undefined,
      updatedAt: resource.updatedAt ? new Date(resource.updatedAt) : undefined,
      createdBy: resource.createdBy
    });
  }

  toEntitiesFromResponse(response: ProductResponse[]): Product[] {
    return response.map((resource) => this.toEntityFromResource(resource));
  }

  toResourceFromEntity(entity: Product): ProductResponse {
    return {
      id: entity.id,
      companyId: entity.companyId,
      name: entity.name,
      sku: entity.sku.value,
      category: entity.category,
      unit: entity.unit,
      currentStock: entity.currentStock,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      createdBy: entity.createdBy
    };
  }
}
