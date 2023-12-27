import { TaxRate } from "@shared/models/tax-rate.model";
import { TaxScheme } from "@shared/models/tax-scheme.model";

export interface ItemTax {
    baseAmount: number,
    taxRate: TaxRate,
    taxScheme: TaxScheme,
    totalRate: number
}