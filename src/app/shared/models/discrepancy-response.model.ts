export class DiscrepancyResponse {
  id?: string = '';
  code: string = '';
  description: string = '';
  operationType: string = '';

  constructor(data: Partial<DiscrepancyResponse> = {}) {
    Object.assign(this, data);
  }
}
