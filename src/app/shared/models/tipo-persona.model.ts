export class TipoPersona {
    tipoPersonaId?: number = 0;
    descripcion: string = '';    
  
    constructor(data: Partial<TipoPersona> = {}) {
      Object.assign(this, data);
    }
  }