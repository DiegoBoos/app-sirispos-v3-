export class UnitCode {
  id?: string = '';
  code: string = '';
  description: string = '';

  constructor(data: Partial<UnitCode> = {}) {
    Object.assign(this, data);
  }
}
