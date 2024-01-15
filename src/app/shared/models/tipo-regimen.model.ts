export class TipoRegimen {
    tipoRegimenId?: number = 0;
    codigo: string = '';    
    descripcion: string = '';    
  
    constructor(data: Partial<TipoRegimen> = {}) {
      Object.assign(this, data);
    }
  }