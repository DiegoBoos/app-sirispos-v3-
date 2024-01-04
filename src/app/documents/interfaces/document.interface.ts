export interface DocumentEmit {
    id:                  string;
    clienteId:           number;
    issueDate:           Date;
    dueDate:             Date;
    documentType:        string;
    documentTypeCode:    string;
    currency:            string;
    operationType:       string;
    customizationId:     string; // Aplica solo a Salud
    discrepancyResponse: string;
    paymentMean:         string;
    paymentMethod:       string;
    businessRegimen:     string;
    // lineExtensionAmount: number;
    documentItems:       DocumentItem[];
    taxesGenerics:       Tax[];
    attachedFiles:       AttachedFile[];
    globalAllowance:     number;
    tip:                 number;
    delivery:            number;
    notes:               string;
    orderReference:      string;
}

export interface AttachedFile {
    id:     string;
    name:   string;
    base64: string;
    size:   number;
}

export interface DocumentItem {
    id:                         string;
    description:                string;
    standardItemIdentification: string;
    unitCode:                   string;
    quantity:                   number;
    unitPrice:                  number;
    totalAllowanceChargue:      number;
    taxes:                      Tax[];
    allowanceChargues:          AllowanceChargue[];
    total:                      number;
    descriptionUnitCode:        string;
}

export interface AllowanceChargue {
    id:          string;
    code:        string;
    description: string;
    baseAmount:  number;
    amount:      number;
    rate:        number;
}

export interface Tax {
    id:         string;
    rate:       number;
    identifier: string;
    name:       string;
    amount:     number;
    baseamount: number;
}
