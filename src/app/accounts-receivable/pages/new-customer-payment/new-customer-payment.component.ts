import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, LOCALE_ID, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VCliente } from '../../../customers/models/v-cliente.model';
import { SelectCustomerComponent } from '../../../customers/components/select-customer/select-customer.component';
import { DisplaySettingComponent } from '@shared/components/display-setting/display-setting.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { differenceInDays, format } from 'date-fns';
import { ValidatorsService } from '@shared/services/validators.service';
import { SelectTextDirective } from '@shared/directives/select-text.directive';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CustomerPaymentService } from '../../customer-payment.service';
import { TransacCustomerParams } from '../../interfaces/transac-customer-params.interface';
import { VTransacCli } from '../../models/v-transaccli.model';
import { BlockUI, BlockUIModule, NgBlockUI } from 'ng-block-ui';
import { CustomerService } from '../../../customers/customer.service';
import { DiscountParameterClient } from '../../../customers/models/discount-parameter-client.model';
import { MatDialog } from '@angular/material/dialog';
import { RegisterPaymentComponent } from '../../components/register-payment/register-payment.component';

@Component({
  selector: 'app-new-customer-payment',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BlockUIModule,

    SelectCustomerComponent,
    DisplaySettingComponent,

    NgxMaskDirective,
    SelectTextDirective,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }, provideNgxMask()],
  templateUrl: './new-customer-payment.component.html',

  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NewCustomerPaymentComponent {

  @BlockUI('load-data') blockUILoadData!: NgBlockUI;

  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private customerPaymentService = inject(CustomerPaymentService)
  private customerService = inject(CustomerService)
  
  public customerSelected: VCliente = new VCliente();
  public maxDate: Date = new Date();

  private dialog = inject(MatDialog);

  public discountParameterClient = signal<DiscountParameterClient[]>([]);
  
  #transacsCli = signal<VTransacCli[]>([]);
  
  public transacsCli = computed<VTransacCli[]>(() => {
    const transacs:VTransacCli[] = this.#transacsCli();
    transacs.map((transac: VTransacCli) => {
      transac.diasFactura = differenceInDays(new Date(), transac.fechadcto);
      transac.isSelected = false;
      transac.descuentoPago = 0;
      transac.vrPago = 0;
    });
    return transacs;
  }
  );

  totalPayment = signal<number>(0);

  public form: FormGroup = this.fb.group(
    {
      clienteId: [null, [Validators.required]],
      fecha: [format(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      recibo: ['', [Validators.required]],
      vrRecibo: [0, [Validators.required]],
      observacion: ['']
     
    },
    {
      validators: [
        // this.validatorsService.dueDateValidator('issueDate', 'dueDate'),
        // this.validatorsService.operationTypeValidator(
        //   'operationType',
        //   'discrepancyResponse'
        // ),
      ],
    }
  );

  loadCustomer(e: any) {
    this.customerSelected = e;
    this.form.controls['clienteId'].setValue(this.customerSelected.cliente_id);

    const transacCustomerParams: TransacCustomerParams = {
      isSaldo: 1,
      includeAnulado: 0
    }

    this.customerService.findDiscountParams(this.customerSelected.cliente_id.toString()).subscribe(resp => { 
      if (resp) {
        this.discountParameterClient.set(resp);
      }
      
    });

    this.blockUILoadData!.start('Consultando datos ...');

    this.customerPaymentService.findTransacByClient(this.customerSelected.cliente_id.toString(), transacCustomerParams).subscribe( resp => {
      if (resp) {
        this.#transacsCli.set(resp);
      }
      this.blockUILoadData!.stop();
    })
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  getFieldError(field: string) {
    return this.validatorsService.getFieldError(this.form, field);
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }

  toggleSelection(transac: VTransacCli) {

    if (transac.isSelected) {
      
      let total = 0;
      this.transacsCli().map((i) => {
        total += i.vrPago!;
      }) 
      
      this.totalPayment.set(total);
  
      const dialogRef = this.dialog.open(RegisterPaymentComponent, { data: { transac, discountsParameterClient: this.discountParameterClient() } });
  
      dialogRef.afterClosed().subscribe((result) => {
       
        if (result) {
          // this.loadData();
        }
      });
    }
    

    
  }

 }
