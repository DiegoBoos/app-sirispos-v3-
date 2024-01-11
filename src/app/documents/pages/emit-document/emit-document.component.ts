import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { format } from 'date-fns';

import { SearchParam } from '@shared/interfaces/search-param.interface';
import { DiscrepancyResponse } from '@shared/models/discrepancy-response.model';
import { DiscrepancyResponseService } from '@shared/services/discrepancy-response.service';
import { InvoiceTypeService } from '@shared/services/invoice-type.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SearchCustomerComponent } from '../../../customers/components/search-customer/search-customer.component';
import { VCliente } from '../../../customers/models/v-cliente.model';
import { SearchPaymentsComponent } from '../../../customer-payments/components/search-payments/search-payments.component';
import { SettingService } from '../../../setting/setting.service';
import { InvoiceType } from '@shared/models/invoice-type.model';
import { PaymentMeanService } from '@shared/services/payment-means.service';
import { PaymentMethodService } from '@shared/services/payment-methods.service';
import { DocumentItemsComponent } from '../../components/document-items/document-items.component';
import { SelectCustomerComponent } from '../../../customers/components/select-customer/select-customer.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { TotalsInvoice } from '@shared/interfaces/totals-invoice.interface';
import { initFlowbite } from 'flowbite';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { numberToWords } from '@shared/helpers/number-to-words';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GenericTaxesComponent } from '../../components/generic-taxes/generic-taxes.component';
import { TaxRate } from '@shared/models/tax-rate.model';
import { DocumentItem } from '../../components/document-items/models/document-item.model';
import { TaxScheme } from '@shared/models/tax-scheme.model';
import { ItemTax } from '../../components/document-items/interfaces/item-tax.interface';
import { TaxSchemeService } from '@shared/services/tax-scheme.service';
import { AllowanceChargue } from '../../components/allowance-chargue/models/allowance-charge.model';
import { getObjectValues } from '@shared/helpers/get-object-values';
import { SelectTextDirective } from '@shared/directives/select-text.directive';
import { AttachedFile } from '@shared/components/attach-file/interfaces/attached-file.interface';
import { AttachFileComponent } from '@shared/components/attach-file/attach-file.component';
import { Tax } from '../../components/tax/models/tax.model';
import { Buyer, ContactBuyer, ContactSeller, DocumentEmit, PartylegalEntity, RegistrationAddress, Seller } from '../../interfaces/document.interface';
import { documentTypesTaxxa } from '../../interfaces/document-type-taxxa';

@Component({
  selector: 'app-emit-document',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchCustomerComponent,
    SearchPaymentsComponent,
    DocumentItemsComponent,
    SelectCustomerComponent,
    AttachFileComponent,
    MatDialogModule,
    NgxMaskDirective,
    SelectTextDirective,
  ],
  templateUrl: './emit-document.component.html',
  providers: [{ provide: LOCALE_ID, useValue: 'es' }, provideNgxMask()],
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EmitDocumentComponent implements OnInit {
  private invoiceTypeService = inject(InvoiceTypeService);
  public settingService = inject(SettingService);
  private discrepancyResponseService = inject(DiscrepancyResponseService);
  private paymentMethodService = inject(PaymentMethodService);
  private paymentMeanService = inject(PaymentMeanService);
  private validatorsService = inject(ValidatorsService);

  public invoiceType: InvoiceType = new InvoiceType();
  public invoiceTypes = computed(() => this.invoiceTypeService.invoiceTypes());
  private fb = inject(FormBuilder);

  public customerSelected: VCliente = new VCliente();
  public modalDateId: string = '';

  public discrepancyResponses = computed(() =>
    this.discrepancyResponseService.discrepancyResponses()
  );

  public discrepancyResponsesList: DiscrepancyResponse[] = [];

  public paymentMethods = computed(() =>
    this.paymentMethodService.paymentMethods()
  );

  public paymentMeans = computed(() => this.paymentMeanService.paymentMeans());

  private taxSchemesService = inject(TaxSchemeService);

  private taxSchemes = computed(() => this.taxSchemesService.taxSchemesItems());

  public minDate: Date = new Date();
  public maxDate: Date = new Date();

  public taxSchemesGenerics = computed(() => {
    const taxSchemas = this.taxSchemesService.taxSchemesGenerics();
    taxSchemas.forEach((i) => {
      i.taxRates!.map((j) => (j.rate = Math.trunc(j.rate * 10) / 10));
    });
    return taxSchemas;
  });

  #totalsInvoice = signal<TotalsInvoice>({
    lineCount: 0,
    subTotal: 0,
    allowanceChangueTotal: 0,
    itemsTax: [],
    genericsTax: [],
    total: 0,
    totalInWords: '',
    globalAllowance: 0,
    totalGenericsTax: 0,
    totalToPay: 0,
    tip: 0,
    delivery: 0,
  });

  totalsInvoice = computed(() => this.#totalsInvoice());

  searchParam: SearchParam = {
    pagination: {
      pageSize: 10,
      pageIndex: 0,
      length: 0,
      pages: 0,
    },
    term: '',
  };

  public form: FormGroup = this.fb.group(
    {
      clienteId: [null, [Validators.required]],
      issueDate: [format(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      dueDate: [format(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      operationType:  ['22', [Validators.required]], // Default 22 Nota Crédito sin referencia a facturas
      discrepancyResponse: [null], // Default 22 Nota Crédito sin referencia a facturas
      paymentMean: ['1', [Validators.required]],
      paymentMethod: ['10', [Validators.required]],
      documentItems: [[], [Validators.required]],
      genericsTax: [],
      taxesGenerics: [],
      attachedFiles: [],
      globalAllowance: 0,
      tip: 0,
      delivery: 0,
      notes: [''],
      orderReference: [''],
    },
    {
      validators: [
        this.validatorsService.dueDateValidator('issueDate', 'dueDate'),
        this.validatorsService.operationTypeValidator(
          'operationType',
          'discrepancyResponse'
        ),
      ],
    }
  );

  private dialog = inject(MatDialog);

  #documentItems = signal<DocumentItem[]>([]);

  groupValues = computed(() => {
    // this.#documentItems();
    console.log(this.#documentItems());
    
    this.form.controls['documentItems'].setValue(this.#documentItems());
    return this.calculateTotal();
  });

  private getAllowanceChargueTotal(
    quantity: number,
    allowancesChargues: AllowanceChargue[]
  ): number {
    let itemAllowanceChargueTotal = 0;
    allowancesChargues?.map(
      (i) =>
        (itemAllowanceChargueTotal +=
          quantity * (i.baseAmount * (i.rate / 100)))
    );
    return itemAllowanceChargueTotal;
  }

  groupTaxes(): ItemTax[] {
    const itemTax: ItemTax[] = [];

    this.#documentItems().map((i: DocumentItem) => {
      i.allowanceChargues?.map((j) => (j.baseAmount = i.unitPrice));
      const itemSubtotal = +i.quantity * +i.unitPrice;
      const itemAllowanceChargueTotal = this.getAllowanceChargueTotal(
        i.quantity,
        i.allowanceChargues!
      );

      i.taxRates?.map((taxRate: TaxRate) => {
        const taxScheme: TaxScheme = this.taxSchemes().filter(
          (ts) => ts.identifier === taxRate.tax
        )[0];
        return itemTax.push({
          baseAmount: itemSubtotal + itemAllowanceChargueTotal,
          taxRate,
          taxScheme,
          totalRate: 0,
        });
      });
    });

    // Objeto para almacenar los resultados agrupados
    const groupedByTax: ItemTax = itemTax.reduce((result: any, current) => {
      const tax = current.taxRate.tax;
      const taxValue = +current.baseAmount * (+current.taxRate.rate / 100);
      // Si el grupo aún no existe, créalo con el valor actual
      if (!result[tax]) {
        result[tax] = {
          taxRate: current.taxRate,
          taxScheme: current.taxScheme,
          totalRate: taxValue,
        };
      } else {
        // Si ya existe, simplemente suma el valor actual al totalRate
        result[tax].totalRate += taxValue;
      }

      return result;
    }, {});

    const objValues: any[] = getObjectValues(groupedByTax);
    const itemsTax: any[] = [];
    objValues.map((i) => itemsTax.push(i));

    return itemsTax;
  }

  constructor() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00

    // Establecer la fecha mínima (10 días antes del día actual)
    this.minDate = new Date(currentDate);
    this.minDate.setDate(currentDate.getDate() - 10);

    // Se utiliza para que se ejecute una vez se carguen los documentType
    effect(() => {
      this.onChange({ value: '22' });
    });
  }

  ngOnInit(): void {
    initFlowbite();
  }

  loadCustomer(e: any) {
    this.customerSelected = e;
    this.form.controls['clienteId'].setValue(this.customerSelected.cliente_id);
  }

  onChange(e: any) {
    const code = e.value;
    this.form.controls['discrepancyResponse'].setValue(null);
    this.invoiceType = this.invoiceTypes().filter(
      (i) => i.operationTypes.filter((j) => j.code === code)[0]
    )[0];

    if (code === '22' || code == '32') {
      this.discrepancyResponsesList = [];
    } else {
      this.discrepancyResponsesList = this.discrepancyResponses().filter(
        (i) => i.operationType === code
      );
    }
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  getFieldError(field: string) {
    return this.validatorsService.getFieldError(this.form, field);
  }

  selectDiscounts(e: any) {
    console.log(e);
  }

  loadItems(data: any) {
    this.#documentItems.set(data);
    this.calculateTotal();
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }

  calculateTotal(): TotalsInvoice {
    let totalsInvoice: TotalsInvoice = {
      lineCount: 0,
      subTotal: 0,
      allowanceChangueTotal: 0,
      globalAllowance: 0,
      itemsTax: [],
      genericsTax: [],
      totalGenericsTax: 0,
      total: 0,
      totalToPay: 0,
      totalInWords: '',
      tip: 0,
      delivery: 0,
    };
    const lineCount = this.#documentItems().length;
    let subTotal = 0;
    let allowanceChangueTotal = 0;

    this.#documentItems().map((i) => {
      subTotal += i.quantity * i.unitPrice;
      allowanceChangueTotal += i.totalAllowanceChargue;
    });

    const globalAllowance = +this.form.controls['globalAllowance'].value;
    const tip = +this.form.controls['tip'].value;
    const delivery = +this.form.controls['delivery'].value;

    const itemsTax = this.groupTaxes();
    let totalItemsTaxes: number = 0;
    itemsTax.map((i) => (totalItemsTaxes += i.totalRate));

    const genericsTax: TaxRate[] =
      this.form.controls['genericsTax'].value || [];
    const genericsTaxItem: ItemTax[] = [];

    let totalGenericsTax = 0;
    genericsTax.map((i) => {
      const subtotalAfterAllowance = subTotal + allowanceChangueTotal - globalAllowance;
      const totalRate = subtotalAfterAllowance * (+i.rate / 100);

      genericsTaxItem.push({
        baseAmount: subtotalAfterAllowance,
        taxRate: i,
        taxScheme: i.taxScheme,
        totalRate,
      });
      totalGenericsTax += totalRate;
    });

    const total =
      subTotal +
      allowanceChangueTotal +
      totalItemsTaxes +
      tip +
      delivery -
      globalAllowance;


    const totalToPay = total - totalGenericsTax;  
    const totalInWords = numberToWords(total, {
      plural: 'Pesos M/CTE',
      singular: 'Peso M/CTE',
      centPlural: 'centavos',
      centSingular: 'centavo',
    });

    totalsInvoice.lineCount = lineCount;
    totalsInvoice.subTotal = subTotal;
    totalsInvoice.allowanceChangueTotal = allowanceChangueTotal;
    totalsInvoice.globalAllowance = globalAllowance;
    totalsInvoice.tip = tip;
    totalsInvoice.delivery = delivery;
    totalsInvoice.itemsTax = itemsTax;
    totalsInvoice.total = total;
    totalsInvoice.totalToPay = totalToPay;
    totalsInvoice.totalInWords = totalInWords;
    totalsInvoice.genericsTax = genericsTaxItem;
    totalsInvoice.totalGenericsTax = totalGenericsTax;

    this.#totalsInvoice.set(totalsInvoice);

    return totalsInvoice;
  }

  loadGenericTaxes(): void {
    const subtotal = this.#totalsInvoice().subTotal;
    const totalAllowances = this.#totalsInvoice().allowanceChangueTotal;
    const globalAllowance = this.#totalsInvoice().globalAllowance || 0;

    const baseAmount = subtotal + totalAllowances - globalAllowance;

    const taxRates: TaxRate[] = this.form.controls['genericsTax'].value || [];
    const taxesGenerics: Tax[] = this.form.controls['taxesGenerics'].value || [];

    taxRates.map((i) => {
      const taxScheme: TaxScheme = this.taxSchemesGenerics().filter(
        (ts) => ts.identifier === i.tax
      )[0];

      const { taxRates, ...rest } = taxScheme
      i.taxScheme = rest;
    });

    const dialogRef = this.dialog.open(GenericTaxesComponent, {
      data: { baseAmount, taxesGenerics, taxRates },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { data } = result;

        if (data) {
          const { taxRates, taxesGenerics } = data;

          taxRates?.map((taxRate: TaxRate) => {
            const taxScheme: TaxScheme = this.taxSchemesGenerics().filter(
              (ts) => ts.identifier === taxRate.tax
            )[0];
            const { taxRates, ...rest } = taxScheme
            taxRate.taxScheme = rest;
          });

          if (taxRates) {
            this.form.controls['genericsTax'].setValue(taxRates);
            this.form.controls['taxesGenerics'].setValue(taxesGenerics);

            this.calculateTotal();
          }
        }
      }
    });
  }

  loadAttachedFile(files: AttachedFile[]) {
    this.form.controls['attachedFiles'].setValue(files);
  }

  getFormErrors() {
    const errores: { [key: string]: any } = {};

    // Recorrer todos los controles del formulario
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);

      // Obtener los errores del control si existen
      if (control?.errors) {
        errores[controlName] = control.errors;
      }
    });

    return errores;
  }

  emitDocument() {

    this.form.controls['documentItems'].setValue(this.#documentItems());

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log(this.getFormErrors());
    
      return;
    }
   
    const data = this.form.value;

    const documentItems: any[] = [];

    data.documentItems.map((i: any)=>{
      delete i.taxRates;
      documentItems.push(i);
    });


    const documentTypeTaxxa = documentTypesTaxxa.filter(i=>i.code === this.invoiceType.code)[0];

   
    
    // Buyer

    const buyerSeeting = this.settingService.seeting();
  
    const partyLegalEntityBuyer: PartylegalEntity = {
      docType: buyerSeeting.codigo_alterno,
      docNo: buyerSeeting.identificacion,
      corporateRegistrationSchemename: buyerSeeting.nombre_comercial
    }
    
    const registrationAddressBuyer: RegistrationAddress = {
      countryCode: buyerSeeting.codigo_pais,
      departmentCode: buyerSeeting.codigo_departamento,
      townCode: buyerSeeting.codigo_municipio,
      cityName: buyerSeeting.municipio,
      addressLine1: buyerSeeting.direccion1,
      zip: +buyerSeeting.codpostal
    }

    const contactBuyer: ContactBuyer = {
      contactPerson: `${buyerSeeting.nombre1 || ''} ${buyerSeeting.apellido1 || ''}`,
      electronicMail: buyerSeeting.email,
      telephone: buyerSeeting.telefono,
      registrationAddress: registrationAddressBuyer
    }

    const buyer: Buyer = {
      legalOrganizationType: buyerSeeting.persona === 'NATURAL'? 'person': 'company',
      costumerName: buyerSeeting.nombre_tercero,
      tributaryIdentificationKey: '01', //TODO: Parametrizqcion identificacion tributaria
      tributaryIdentificationName: 'IVA',  //TODO: Parametrizqcion identificacion tributaria
      fiscalResponsibilities: buyerSeeting.responsabilidades_fiscales,
      fiscalRegime: buyerSeeting.codigo_regimen,
      partyLegalEntityBuyer,
      contactBuyer
    }



    // Seller

    const customer = this.customerSelected;

    const partyLegalEntitySeller: PartylegalEntity = {
      docType: customer.tipo_doc,
      docNo: customer.identificacion,
      corporateRegistrationSchemename: customer.nombre_comercial
    }

    const registrationAddressSeller: RegistrationAddress = {
      countryCode: customer.codigo_pais,
      departmentCode: customer.codigo_departamento,
      townCode: customer.codigo_municipio,
      cityName: customer.municipio,
      addressLine1: customer.direccion1,
      zip: +customer.codpostal
    }


    const contactSeller: ContactSeller = {
      contactPerson: customer.contacto_cliente,
      electronicMail: customer.email,
      telephone: customer.telefono,
      registrationAddress: registrationAddressSeller
    }

    const seller: Seller = {
      legalOrganizationType: customer.persona === 'NATURAL'? 'person': 'company',
      costumerName: customer.nombre,
      tributaryIdentificationKey: 'ZZ', //TODO: Parametrizqcion identificacion tributaria
      tributaryIdentificationName: 'No Aplica', //TODO: Parametrizqcion identificacion tributaria
      fiscalResponsibilities: customer.responsabilidades_fiscales,
      fiscalRegime: customer.codigo_regimen,
      partyLegalEntitySeller,
      contactSeller,
      tableInfo: {}
    }

    let totalItemsTax = 0;

    this.#totalsInvoice().itemsTax.map(i=>totalItemsTax += i.totalRate);
    
    const document: DocumentEmit = {
      id: '',
      clienteId: data.clienteId,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      documentType: documentTypeTaxxa.documentType,
      documentTypeCode: this.invoiceType.code,
      currency: 'COP',
      operationType: data.operationType,
      customizationId: '',
      discrepancyResponse: data.discrepancyResponse,
      lineExtensionAmount: this.#totalsInvoice().subTotal,
      taxExclusiveAmount: this.#totalsInvoice().subTotal + this.#totalsInvoice().allowanceChangueTotal,
      taxInclusiveAmount: this.#totalsInvoice().subTotal + this.#totalsInvoice().allowanceChangueTotal + totalItemsTax + this.#totalsInvoice().totalGenericsTax,
      paylableAmount: this.#totalsInvoice().total,
      paymentMean: data.paymentMean,
      paymentMethod: data.paymentMethod,
      businessRegimen: this.settingService.seeting().codigo_persona,
      documentItems,
      genericsTax: data.taxesGenerics,
      attachedFiles: data.attachedFiles,
      globalAllowance: data.globalAllowance,
      tip: data.tip,
      delivery: data.delivery,
      notes: data.notes,
      orderReference: data.orderReference,
      buyer,
      seller
    }
    console.log(document);


  }
}
