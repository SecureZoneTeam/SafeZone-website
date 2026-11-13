import { Sku } from './sku';

describe('Sku', () => {
  it('normalizes a valid SKU to uppercase', () => {
    expect(new Sku(' net-utp6-305 ').value).toBe('NET-UTP6-305');
  });

  it('rejects values outside the SKU format', () => {
    expect(Sku.isValid('NET UTP')).toBeFalse();
    expect(Sku.isValid('AB')).toBeFalse();
    expect(Sku.isValid('A'.repeat(33))).toBeFalse();
  });
});
