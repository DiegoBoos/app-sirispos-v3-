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
import { format } from "date-fns";

import { SearchParam } from '@shared/interfaces/search-param.interface';
import { DiscrepancyResponse } from '@shared/models/discrepancy-response.model';
import { DiscrepancyResponseService } from '@shared/services/discrepancy-response.service';
import { InvoiceTypeService } from '@shared/services/invoice-type.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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


@Component({
  selector: 'app-emit-document',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SearchCustomerComponent, SearchPaymentsComponent, DocumentItemsComponent, SelectCustomerComponent],
  templateUrl: './emit-document.component.html',
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
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

  public paymentMeans = computed(() =>
    this.paymentMeanService.paymentMeans()
  );

  public minDate: Date = new Date();
  public maxDate: Date = new Date();


  #totalsInvoice = signal<TotalsInvoice | null>(null);
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

  public form: FormGroup = this.fb.group({
    clienteId: null,
    issueDate: [format(new Date(),'yyyy-MM-dd'), [Validators.required]],
    dueDate: [format(new Date(),'yyyy-MM-dd'), [Validators.required]],
    documentType: [22, [Validators.required]], // Default 22 Nota Crédito sin referencia a facturas
    operationType: [null, [Validators.required]],
    paymentMean: [1, [Validators.required]],
    paymentMethod: [10, [Validators.required]],
    notes: [''],
    ordeReference: [''],
   
  }, {
    validators: [
      this.validatorsService.dueDateValidator('issueDate', 'dueDate'),
      this.validatorsService.operationTypeValidator('documentType', 'operationType'),
    ]
  }
  
  );

  constructor() {

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00

    // Establecer la fecha mínima (10 días antes del día actual)
    this.minDate = new Date(currentDate);
    this.minDate.setDate(currentDate.getDate() - 10);

    // Se utiliza para que se ejecute una vez se carguen los documentType
    effect( () => {
      this.onChange({value: '22'});
    })
  }


  ngOnInit(): void {
    initFlowbite();
  }

  loadCustomer(e: any) {
    this.customerSelected = e;
  }

  onChange(e: any) {
    
    const code = e.value;
    this.invoiceType = this.invoiceTypes().filter(i=>i.operationTypes.filter(j=>j.code === code)[0])[0];
    
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

 
}
