import { TaxRate } from "@shared/models/tax-rate.model";
import { ItemTax } from "../../documents/components/document-items/interfaces/item-tax.interface";

export interface TotalsInvoice {
    lineCount:   number,
    subTotal: number,
    allowanceChangueTotal: number,
    itemsTax: ItemTax[],
    genericsTax: ItemTax[],
    total: number,
    totalInWords: string
    globalAllowance: number,
    totalGenericsTax: number,
    totalToPay: number,
    tip: number,
    delivery: number,
}