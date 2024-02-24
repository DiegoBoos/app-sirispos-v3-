import { InvoiceEvent } from "./invoice-event.model";
import { Messenger } from "./messenger.model";

export class MessengerEvent {
  
    id?: string;
    concept?: string;
    messengerId?: string;
    startDate?: Date;
    endDate?: Date;
    observation?: string;
    dateDiffhours?: number;
    dateDiffminutes?: number;
    invoicesEvent?: InvoiceEvent[];
    messenger?: Messenger;
  
    constructor(data: Partial<MessengerEvent> = {}) {
      Object.assign(this, data);
    }
  }