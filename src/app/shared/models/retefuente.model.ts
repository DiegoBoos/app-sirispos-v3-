export class ReteFuente {
    retefteId?: number = 0;
    descripcion: string = '';
    base: number = 0;
    tarifa: number = 0;
    estado: number = 0;
    
  
    constructor(data: Partial<ReteFuente> = {}) {
      Object.assign(this, data);
    }
  }