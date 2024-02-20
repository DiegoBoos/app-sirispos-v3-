export class Messenger {
    id?: string;
    identification: string = '';
    name?: string = '';
  
    constructor(data: Partial<Messenger> = {}) {
      Object.assign(this, data);
    }
  }