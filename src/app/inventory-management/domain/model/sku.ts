/** Product SKU value object with canonical uppercase formatting. */
export class Sku {
  readonly value: string;

  constructor(value: string) {
    const normalizedValue = value.trim().toUpperCase();

    if (!Sku.isValid(normalizedValue)) {
      throw new Error('inventory.validation.skuInvalid');
    }

    this.value = normalizedValue;
  }

  static isValid(value: string): boolean {
    return value.length >= 3 &&
      value.length <= 32 &&
      /^[A-Z0-9]+(-[A-Z0-9]+)*$/.test(value.trim().toUpperCase());
  }

  toString(): string {
    return this.value;
  }
}
