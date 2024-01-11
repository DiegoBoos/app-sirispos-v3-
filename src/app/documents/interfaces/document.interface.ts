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
    lineExtensionAmount: number;
    taxExclusiveAmount:  number;
    taxInclusiveAmount:  number;
    paylableAmount:      number;
    paymentMean:         string;
    paymentMethod:       string;
    businessRegimen:     string;
    // lineExtensionAmount: number;
    documentItems:       DocumentItem[];
    genericsTax:       Tax[];
    attachedFiles:       AttachedFile[];
    globalAllowance:     number;
    tip:                 number;
    delivery:            number;
    notes:               string;
    orderReference:      string;
    buyer:               Buyer;
    seller:              Seller;
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
    baseAmount: number;
}

export interface Buyer {
    legalOrganizationType:       string;
    costumerName:                string;
    tributaryIdentificationKey:  string;
    tributaryIdentificationName: string;
    fiscalResponsibilities:      string;
    fiscalRegime:                string;
    partyLegalEntityBuyer:       PartylegalEntity;
    contactBuyer:                ContactBuyer;
}

export interface ContactBuyer {
    contactPerson:       string;
    electronicMail:      string;
    telephone:           string;
    registrationAddress: RegistrationAddress;
}

export interface ContactSeller {
    contactPerson:       string;
    electronicMail:      string;
    telephone:           string;
    registrationAddress: RegistrationAddress;
}

export interface RegistrationAddress {
    countryCode:    string;
    departmentCode: string;
    townCode:       string;
    cityName:       string;
    addressLine1:   string;
    zip:            number;
}

export interface PartylegalEntity {
    docType:                         string;
    docNo:                           string;
    corporateRegistrationSchemename: string;
}

export interface Seller {
    legalOrganizationType:       string;
    costumerName:                string;
    tributaryIdentificationKey:  string;
    tributaryIdentificationName: string;
    fiscalResponsibilities:      string;
    fiscalRegime:                string;
    partyLegalEntitySeller:      PartylegalEntity;
    contactSeller:               ContactSeller;
    // cableinfo:                   cableinfo; // Para empresas de servicio de cable
    tableInfo:                   { [key: string]: TableInfo };
    // extrainfo:                   ExtraInfo; // Para indormación adicional de salud
}

export interface TableInfo {
    val1: string;
    val2: string;
}

// export interface ExtraInfo {
//     aappointments:    Aappointments;
//     spatientname:     string;
//     spatientid:       string;
//     icustomerage:     string;
//     ssociallevel:     string;
//     mpatientcharge:   string;
//     mprepayment:      string;
//     mpatientcopay:    string;
//     mpatientpayment:  string;
//     mpatientiva:      string;
//     mpatientdiscount: string;
//     mdiscounteapb:    string;
//     mivaservices:     string;
//     musersubtotal:    string;
//     musertotal:       string;
//     mwarrant:         string;
//     sregime:          string;
//     scontractid:      string;
//     ssalespersonname: string;
//     iitemscount:      string;
//     slocationname:    string;
//     xdocumentnote2:   string;
//     sbarcodedata:     string;
//     xpqrinfo:         string;
//     xlegalinfo:       string;
// }
