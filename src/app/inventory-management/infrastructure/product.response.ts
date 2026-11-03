import { BaseResponse } from '../../shared/infrastructure/base-response';

/** Product resource exposed by the inventory API. */
export interface ProductResponse extends BaseResponse {
  companyId: number | string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentStock: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}
