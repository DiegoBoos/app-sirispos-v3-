export class OperationType {
  id?: string = '';
  code: string = '';
  description: string = '';
  documentType: string = '';
  

  constructor(data: Partial<OperationType> = {}) {
    Object.assign(this, data);
  }
}
