export class AllowanceChargueCode {
  id?: string = '';
  code: string = '';
  description: string = '';

  constructor(data: Partial<AllowanceChargueCode> = {}) {
    Object.assign(this, data);
  }
}
