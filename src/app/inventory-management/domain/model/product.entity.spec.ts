import { Product, ProductCategory } from './product.entity';
import { Sku } from './sku';

describe('Product', () => {
  const product = new Product({
    id: 1,
    companyId: 1,
    name: 'Cable UTP Cat6',
    sku: new Sku('NET-UTP6'),
    category: ProductCategory.Networking,
    unit: 'UNIT',
    currentStock: 3
  });

  it('allows dispatch only for a positive integer within available stock', () => {
    expect(product.canDispatch(3)).toBeTrue();
    expect(product.canDispatch(4)).toBeFalse();
    expect(product.canDispatch(0)).toBeFalse();
    expect(product.canDispatch(1.5)).toBeFalse();
  });

  it('reports when no units are in stock', () => {
    expect(new Product({ currentStock: 0 }).isOutOfStock).toBeTrue();
    expect(product.isOutOfStock).toBeFalse();
  });
});
