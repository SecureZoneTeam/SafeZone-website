import { AuditTrail } from '@shared/domain/model/audit-trail';
import { BaseEntity } from '@shared/domain/model/base-entity';
import { Sku } from './sku';

/** Product categories available in the inventory catalog. */
export enum ProductCategory {
  Networking = 'NETWORKING',
  Security = 'SECURITY',
  Computing = 'COMPUTING',
  Electronics = 'ELECTRONICS',
  Accessories = 'ACCESSORIES',
  Other = 'OTHER'
}

/** Inventory product aggregate root. */
export class Product implements BaseEntity, AuditTrail {
  id: number | string;
  companyId: number | string;
  name: string;
  sku: Sku;
  category: ProductCategory;
  unit: string;
  currentStock: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;

  constructor(product: {
    id?: number | string;
    companyId?: number | string;
    name?: string;
    sku?: Sku;
    category?: ProductCategory;
    unit?: string;
    currentStock?: number;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
  } = {}) {
    this.id = product.id ?? 0;
    this.companyId = product.companyId ?? 1;
    this.name = product.name ?? '';
    this.sku = product.sku ?? new Sku('SKU-NEW');
    this.category = product.category ?? ProductCategory.Other;
    this.unit = product.unit ?? 'UNIT';
    this.currentStock = product.currentStock ?? 0;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
    this.createdBy = product.createdBy;
  }

  /** Returns whether the product has enough stock for a dispatch quantity. */
  canDispatch(quantity: number): boolean {
    return Number.isInteger(quantity) && quantity > 0 && quantity <= this.currentStock;
  }

  /** Indicates that no units are currently available. */
  get isOutOfStock(): boolean {
    return this.currentStock <= 0;
  }
}
