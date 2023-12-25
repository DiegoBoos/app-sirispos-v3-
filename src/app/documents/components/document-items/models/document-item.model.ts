import { AllowanceChargue } from "../../allowance-chargue/models/allowance-charge.model";


export class DocumentItem {
    consecutive: number = 0;
    description: string = '';
    standardItemIdentification: string = '';
    unitCode: string = '';
    unitPrice: number = 0;
    total: number = 0;
    quantity: number = 0;
    totalAllowanceChargue: number = 0;
    allowanceChargue?: AllowanceChargue[] = [];
    descriptionUnitCode?: string;
    
  
    constructor(data: Partial<DocumentItem> = {}) {
      Object.assign(this, data);
    }
  }
  