export class TaxRate {
  id?: string = '';
  tax: string = '';
  description: string = '';
  rate: number = 0;

  constructor(data: Partial<TaxRate> = {}) {
    Object.assign(this, data);
  }
}
