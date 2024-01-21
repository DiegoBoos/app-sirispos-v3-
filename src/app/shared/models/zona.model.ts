export class Zona {
  zonaId?: string = '';
  descripcion: string = '';

  constructor(data: Partial<Zona> = {}) {
    Object.assign(this, data);
  }
}
