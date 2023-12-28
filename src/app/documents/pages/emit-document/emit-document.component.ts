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
import { TaxScheme } from '@shared/models/tax-scheme.model';
import { TaxSchemeService } from '@shared/services/tax-scheme.service';

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
    MatDialogModule,
    NgxMaskDirective,
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
  private taxSchemesService = inject(TaxSchemeService);

  private taxSchemes = computed(()=>this.taxSchemesService.taxSchemesGenerics())

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

  public minDate: Date = new Date();
  public maxDate: Date = new Date();

  #totalsInvoice = signal<TotalsInvoice>({
    lineCount: 0,
    subTotal: 0,
    allowanceChangueTotal: 0,
    itemsTax: [],
    total: 0,
    totalInWords: '',
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
      clienteId: null,
      issueDate: [format(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      dueDate: [format(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      documentType: [22, [Validators.required]], // Default 22 Nota Crédito sin referencia a facturas
      operationType: [null, [Validators.required]],
      paymentMean: [1, [Validators.required]],
      paymentMethod: [10, [Validators.required]],
      globalAllowance: 0,
      taxRates: [],
      tip: 0,
      delivery: 0,
      notes: [''],
      ordeReference: [''],
    },
    {
      validators: [
        this.validatorsService.dueDateValidator('issueDate', 'dueDate'),
        this.validatorsService.operationTypeValidator(
          'documentType',
          'operationType'
        ),
      ],
    }
  );

  private dialog = inject(MatDialog);

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
  }

  onChange(e: any) {
    const code = e.value;
    this.invoiceType = this.invoiceTypes().filter(
      (i) => i.operationTypes.filter((j) => j.code === code)[0]
    )[0];

    if (code === '22' || code == '32') {
      this.discrepancyResponsesList = [];
    } else {
      this.discrepancyResponsesList = this.discrepancyResponses().filter(
        (i) => i.noteType === code
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

  loadTotalsInvoice(data: TotalsInvoice) {
    this.#totalsInvoice.set(data);
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }

  calculateTotal() {
    this.#totalsInvoice.update((state) => {
      const subTotal = state.subTotal;
      const allowanceChangueTotal = state.allowanceChangueTotal;
      const tip = +this.form.controls['tip'].value;
      const delivery = +this.form.controls['delivery'].value;
      const globalAllowance = +this.form.controls['globalAllowance'].value;

      let totalTaxes: number = 0;
      state.itemsTax.map((i) => (totalTaxes += i.totalRate));
      const total = subTotal + allowanceChangueTotal + totalTaxes + tip + delivery - globalAllowance;
      const totalInWords = numberToWords(total, {
        plural: 'Pesos M/CTE',
        singular: 'Peso M/CTE',
        centPlural: 'centavos',
        centSingular: 'centavo',
      });
      state.tip = tip;
      state.delivery = delivery;  
      state.globalAllowance = globalAllowance;
      state.total = total;
      state.totalInWords = totalInWords;

      return {
        ...state,
      };
    });
  }

  

  loadGenericTaxes(): void {
    const baseAmount = this.#totalsInvoice().subTotal;
    const dialogRef = this.dialog.open(GenericTaxesComponent, {
      data: { baseAmount, taxRates: this.form.controls['taxRates'].value },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { data } = result;

          if (data) {
            const { taxRates } = data;
  
            taxRates?.map((taxRate: TaxRate) => {
              const taxScheme: TaxScheme = this.taxSchemes().filter(ts=>ts.identifier===taxRate.tax)[0];
              taxRate.taxScheme = taxScheme;
            });

            if (taxRates) {
              this.form.controls['taxRates'].setValue(taxRates);
           
              this.calculateTotal();
            }
          }
      }
    });
  }
}
