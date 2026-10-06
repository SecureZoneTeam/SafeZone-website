/** Value object representing a monetary amount with its currency. */
export class Money {
  constructor(
    public readonly amount = 0,
    public readonly currency = 'USD'
  ) {}

  toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}
