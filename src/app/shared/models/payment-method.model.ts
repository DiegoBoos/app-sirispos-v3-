export class PaymentMethod {
  id?: string = '';
  code: string = '';
  description: string = '';

  constructor(data: Partial<PaymentMethod> = {}) {
    Object.assign(this, data);
  }
}
