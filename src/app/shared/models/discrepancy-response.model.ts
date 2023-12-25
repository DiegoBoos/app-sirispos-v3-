export class DiscrepancyResponse {
  id?: string = '';
  code: string = '';
  description: string = '';
  noteType: string = '';

  constructor(data: Partial<DiscrepancyResponse> = {}) {
    Object.assign(this, data);
  }
}
