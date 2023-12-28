import { TaxScheme } from "./tax-scheme.model";

export class TaxRate {
  id?: string = '';
  tax: string = '';
  description: string = '';
  rate: number = 0;
  taxScheme: TaxScheme = new TaxScheme();

  constructor(data: Partial<TaxRate> = {}) {
    Object.assign(this, data);
  }
}
