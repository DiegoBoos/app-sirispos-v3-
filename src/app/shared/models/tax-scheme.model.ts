import { TaxRate } from "./tax-rate.model";

export class TaxScheme {
  id?: string = '';
  identifier: string = '';
  name: string = '';
  description: string = '';
  taxRates?: TaxRate[] = [];

  constructor(data: Partial<TaxScheme> = {}) {
    Object.assign(this, data);
  }
}
