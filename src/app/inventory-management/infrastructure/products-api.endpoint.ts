import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api.endpoint';
import { environment } from '../../../environments/environment';
import { Product } from '../domain/model/product.entity';
import { ProductAssembler } from './product.assembler';
import { ProductResponse } from './product.response';

const productsResourceEndpointPath = '/products';

/** API endpoint for product catalog reads. */
@Injectable({ providedIn: 'root' })
export class ProductsApiEndpoint extends BaseApiEndpoint<
  Product,
  ProductResponse,
  ProductAssembler
> {
  constructor() {
    super(
      inject(HttpClient),
      `${environment.serverBaseUrl}${productsResourceEndpointPath}`,
      new ProductAssembler()
    );
  }
}
