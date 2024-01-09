export class Tax {
    rate: number = 0;
    identifier: string = '';
    name: string = '';
    amount: number = 0;
    baseAmount: number = 0;
      
    constructor(data: Partial<Tax> = {}) {
      Object.assign(this, data);
    }
  }
  