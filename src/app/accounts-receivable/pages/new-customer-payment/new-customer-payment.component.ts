import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { VCliente } from '../../../customers/models/v-cliente.model';
import { SelectCustomerComponent } from '../../../customers/components/select-customer/select-customer.component';
import { DisplaySettingComponent } from '@shared/components/display-setting/display-setting.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { initFlowbite } from 'flowbite';
import Swal from 'sweetalert2';
import { PagoCli } from '../../models/pagocli.model';
import { PagoscliTransac } from '../../models/pagocli-transac.model';
import { Notascli } from '../../models/notascli.model';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

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
export default class NewCustomerPaymentComponent implements OnInit {

  private router = inject(Router);
  @BlockUI('load-data') blockUILoadData!: NgBlockUI;

  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private customerPaymentService = inject(CustomerPaymentService);
  private customerService = inject(CustomerService);

  public customerSelected: VCliente = new VCliente();
  public maxDate: Date = new Date();

  private dialog = inject(MatDialog);

  public discountParameterClient = signal<DiscountParameterClient[]>([]);

  #transacsCli = signal<VTransacCli[]>([]);

  // public transacsCli = computed<VTransacCli[]>(() => {
  //   const transacs:VTransacCli[] = this.#transacsCli();
  //   transacs.map((transac: VTransacCli) => {
  //     transac.diasFactura = differenceInDays(new Date(), transac.fechadcto);
  //     transac.isSelected = false;
  //     transac.descuentoPago = 0;
  //     transac.vrPago = 0;
  //   });
  //   return transacs;
  // }
  // );

  public transacsCli = computed<VTransacCli[]>(() => this.#transacsCli());

  totalPayment = signal<number>(0);

  public form: FormGroup = this.fb.group(
    {
      clienteId: [null, [Validators.required]],
      fecha: [format(new Date(), 'yyyy-MM-dd'), [Validators.required]],
      recibo: ['', [Validators.required]],
      vrRecibo: [0, [Validators.required]],
      observacion: [''],
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

  ngOnInit(): void {
    initFlowbite();
  }

  loadCustomer(e: any) {
    this.customerSelected = e;
    this.form.controls['clienteId'].setValue(this.customerSelected.cliente_id);

    const transacCustomerParams: TransacCustomerParams = {
      isSaldo: 1,
      includeAnulado: 0,
    };

    this.customerService
      .findDiscountParams(this.customerSelected.cliente_id.toString())
      .subscribe((resp) => {
        if (resp) {
          this.discountParameterClient.set(resp);
        }
      });

    this.blockUILoadData!.start('Consultando datos ...');

    this.customerPaymentService
      .findTransacByClient(
        this.customerSelected.cliente_id.toString(),
        transacCustomerParams
      )
      .subscribe((resp) => {
        if (resp) {
          const transacs: VTransacCli[] = [];
          resp.map((transac: VTransacCli) => {
            transac.diasFactura = differenceInDays(
              new Date(),
              transac.fechadcto
            );
            transac.isSelected = false;
            transac.descuentoPago = 0;
            transac.vrPago = 0;
            transacs.push(transac);
          });
          this.#transacsCli.set(transacs);
        }
        this.blockUILoadData!.stop();
      });
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  getFieldError(field: string) {
    return this.validatorsService.getFieldError(this.form, field);
  }

  saveObject(notasCli?: Notascli): void {
    const user = JSON.parse(localStorage.getItem('user-app-spv3') || '');
    const tipo = this.totalPayment() > 0 ? 'P' : 'C';

    const pagoCli: PagoCli = {
      pagocliId: 0,
      clienteId: this.customerSelected.cliente_id,
      fecha: new Date(format(this.form.controls['fecha'].value, 'yyyy-MM-dd')),
      tipo,
      useridConfirma: user.user_id,
      valor: this.totalPayment(),
      vrRecibo: +this.form.controls['vrRecibo'].value,
      recibo: this.form.controls['recibo'].value,
      anulado: 0,
      observacion: this.form.controls['observacion'].value,
    };

    let pagosCliTransac: PagoscliTransac[] = [];

    this.#transacsCli().filter(i=>i.isSelected).map((transac) => {
      const pagoTransacCli: PagoscliTransac = {
        pagoclitransacId: 0,
        pagocliId: 0,
        tipoDcto: transac.tipodcto,
        transacId: transac.transaccliId,
        subtotal: +transac.vrPago! + +transac.descuentoPago!,
        descuento: transac.descuentoPago!,
        vrPago: transac.vrPago!,
        isGenerateNote: 0,
      };
      pagosCliTransac.push(pagoTransacCli);
    });

    pagoCli.pagosCliTransac = [...pagosCliTransac];

    if (notasCli) {
      pagoCli.notasCli = notasCli;
    }

    this.customerPaymentService.payRegister(pagoCli).subscribe((resp: any)=>{
      if (resp) {
        // const { data } = resp;
        // const pagoCli: PagoCli = data;
        
        // this.customerPaymentService.getPayReport(pagoCli.pagocliId).subscribe((data) => {
        //   const base64 = data;
        //   const fileName = `${pagoCli.nrodcto}.pdf`;
          
        //   const dialogRef = this.dialog.open(PdfViewerComponent, {
        //     data: { base64, fileName }, disableClose: true,
        //   });
        //   dialogRef.afterClosed().subscribe(() => {
        //     this.router.navigateByUrl('/dashboard/customer-payments');
        //   });
        // });
        Swal.fire('Transacción exitosa', 'Pago registrado correctamente','success');
        this.router.navigateByUrl('/dashboard/customer-payments');
      }
    })
  }

  onSave() {
    const vrRecibo = +this.form.controls['vrRecibo'].value;

    if (+this.totalPayment() > vrRecibo) {
      this.form.controls['vrRecibo'].setErrors({ notValidPay: true });
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (+this.totalPayment() < vrRecibo) {
      Swal.fire({
        title: 'Advertencia',
        text: 'El valor del recibo es mayor al total a pagar se generará una nota crédito. Desea continuar?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      }).then((resutl) => {
        if (resutl.isConfirmed) {
          const user = JSON.parse(localStorage.getItem('user-app-spv3') || '');
          const difRecibo = +vrRecibo - +this.totalPayment();
          const notacli: Notascli = {
            notascliId: 0,
            nrodcto: null,
            fechanota: new Date(format(this.form.controls['fecha'].value, 'yyyy-MM-dd')),
            fechavence: null,
            clienteId: this.customerSelected.cliente_id,
            tipo: 'C',
            cufe: null,
            vrExcluido: 0,
            vrGravado: 0,
            iva: 0,
            retefuente: 0,
            reteiva: 0,
            reteica: 0,
            vrTotal: difRecibo,
            saldo: difRecibo,
            useridConfirma: user.user_id,
            observa: `SOBRANTE RECIBO # ${this.form.controls['recibo'].value}`,
            conceptonotacliId: -1,
            recibo: this.form.controls['recibo'].value,
            anulado: 0,
            observaanula: null,
            dctoElectronico: 0,
            factura: null
          }

          this.saveObject(notacli);
        }
      });
    } else {
      this.saveObject();
    }


    
  }

  totalize() {
    let total = 0;
    this.#transacsCli().map((i) => {
      total += i.vrPago!;
    });
    this.totalPayment.set(parseFloat(total.toFixed(2)));
  }

  toggleSelection(transac: VTransacCli) {
    const transacIndex = this.#transacsCli().findIndex(
      (i) => i.transaccliId === transac.transaccliId
    );
    const transacs = this.#transacsCli();

    if (transac.isSelected) {
      if (transac.tipodcto === 'FV') {
        const dialogRef = this.dialog.open(RegisterPaymentComponent, {
          data: {
            transac,
            discountsParameterClient: this.discountParameterClient(),
          },
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            const { action, data } = result;

            const transac: VTransacCli = data;
            // const transacs = this.#transacsCli();

            if (action === 'ok') {
              transacs[transacIndex] = transac;
            } else {
              transacs[transacIndex].isSelected = false;
            }

            this.#transacsCli.set([...transacs]);
            this.totalize();
          }
        });
      } else {
        if (transac.tipodcto === 'DV' || transac.tipodcto === 'NC') {
          transacs[transacIndex].vrPago = +transacs[transacIndex].saldo * -1;
          this.#transacsCli.set([...transacs]);
          this.totalize();
        }
      }
    } else {
      transacs[transacIndex].descuentoPago = 0;
      transacs[transacIndex].vrPago = 0;
      this.#transacsCli.set([...transacs]);
      this.totalize();
    }
  }
}
