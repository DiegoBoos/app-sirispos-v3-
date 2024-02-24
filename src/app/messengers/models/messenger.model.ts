export class Messenger {
    id?: string;
    identification: string = '';
    name?: string = '';
    isActive?: number = 1;
  
    constructor(data: Partial<Messenger> = {}) {
      Object.assign(this, data);
    }
  }