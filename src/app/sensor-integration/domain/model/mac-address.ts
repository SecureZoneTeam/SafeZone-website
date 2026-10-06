/** Value object representing the hardware address of an ESP32 sensor node. */
export class MacAddress {
  private static readonly pattern = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;

  constructor(public readonly value: string) {
    this.value = value.toUpperCase();
  }

  get isValid(): boolean {
    return MacAddress.pattern.test(this.value);
  }

  toString(): string {
    return this.value;
  }
}
