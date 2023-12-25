export class PaymentMean {
  id?: string = '';
  code: string = '';
  description: string = '';

  constructor(data: Partial<PaymentMean> = {}) {
    Object.assign(this, data);
  }
}
