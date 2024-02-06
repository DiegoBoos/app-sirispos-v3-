export class PagoscliTransac {
    pagoclitransacId: number = 0;
    pagocliId: number = 0;
    tipoDcto: string = '';
    transacId: number = 0;
    subtotal: number = 0.0;
    descuento: number = 0.0;
    vrPago: number = 0.0;
    isGenerateNote: number = 0;
  
    constructor(data: Partial<PagoscliTransac> = {}) {
      Object.assign(this, data);
    }
  }
  