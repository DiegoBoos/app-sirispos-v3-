

export class DiscountParameterClient {
    id?: number;
    clienteId?: number;
    days?: number;
    rate?: number;
    
    constructor(data: Partial<DiscountParameterClient> = {}) {
      Object.assign(this, data);
    }
  }