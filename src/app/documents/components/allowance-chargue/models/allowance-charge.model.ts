export class AllowanceChargue {
    rate: number = 0;
    code: string = '';
    baseAmount: number = 0;
    amount: number = 0;
    description?: string = '';
  
    constructor(data: Partial<AllowanceChargue> = {}) {
      Object.assign(this, data);
    }
  }