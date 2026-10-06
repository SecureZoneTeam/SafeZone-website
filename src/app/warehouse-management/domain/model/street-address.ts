/** Value object describing the physical location of a warehouse. */
export class StreetAddress {
  constructor(
    public readonly street = '',
    public readonly district = '',
    public readonly city = '',
    public readonly country = 'PE'
  ) {}

  toString(): string {
    return [this.street, this.district, this.city, this.country].filter(Boolean).join(', ');
  }
}
