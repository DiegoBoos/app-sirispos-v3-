import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  Optional,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { SelectTextDirective } from '@shared/directives/select-text.directive';
import { ValidatorsService } from '@shared/services/validators.service';
import { initFlowbite } from 'flowbite';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import Swal from 'sweetalert2';
import { VTransacCli } from '../../models/v-transaccli.model';
import { DiscountParameterClient } from '../../../customers/models/discount-parameter-client.model';

@Component({
  selector: 'app-register-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    SelectTextDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './register-payment.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPaymentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  #rateDiscount = signal<number>(0);
  public newSaldo = signal<number>(0);
  public payOptions = [
    { id: 'T', description: 'Pago Total' },
    { id: 'A', description: 'Abono' },
  ];
  public payOptionSelected = 'T';

  rateDiscount = computed(() => {
    // this.form.controls['rateValue'].setValue(this.#rateDiscount())
    return this.#rateDiscount();
  });

  public form: FormGroup = this.fb.group(
    {
      id: [null],
      payValue: [0, [Validators.required, Validators.min(1)]],
      discountValue: [0, [Validators.required]],
      rateValue: [0, [Validators.required, Validators.max(100)]],
    },
    {
      validators: [
        // this.validatorsService.tipoPersonaValidator(
        //   'tipoPersonaId',
        //   'apellido1',
        //   'nombre1',
        //   'tributaryIdentificationName'
        // ),
      ],
    }
  );

  public transac = signal<VTransacCli>(new VTransacCli());

  constructor(
    public dialogRef: MatDialogRef<RegisterPaymentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any
  ) {
    const { transac, discountsParameterClient } = obj;

    const vTransacCli: VTransacCli = transac;
    if (discountsParameterClient) {
      const discounts: DiscountParameterClient[] = discountsParameterClient;

      const discountApply: DiscountParameterClient = discounts
        .filter((i) => +vTransacCli.diasFactura! <= +i.days!)
        .sort((a, b) => +a.days! - +b.days!)[0];

      if (discountApply) {
        this.#rateDiscount.set(discountApply.rate!);
      }
    }
    this.transac.set(vTransacCli);
  }

  ngOnInit(): void {
    initFlowbite();
    const discountValue = (+this.#rateDiscount() * this.transac().saldo) / 100;
    const payValue = this.transac().saldo - discountValue;
    this.form.controls['rateValue'].setValue(this.#rateDiscount());
    this.form.controls['payValue'].setValue(payValue);
    this.form.controls['discountValue'].setValue(discountValue);
    this.newSaldo.set(this.transac().saldo - payValue - discountValue);
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  isValidFieldFormArray(form: any, field: string) {
    return this.validatorsService.isValidField(form, field);
  }

  getFieldError(field: string) {
    return this.validatorsService.getFieldError(this.form, field);
  }

  getFormErrors() {
    const errores: { [key: string]: any } = {};

    // Recorrer todos los controles del formulario
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);

      // Obtener los errores del control si existen
      if (control?.errors) {
        errores[controlName] = control.errors;
      }
    });

    return errores;
  }

  changePayOption() {
    if (this.payOptionSelected === 'T') {
      this.calculateByRateValue();
    }
  }

  calculateByRateValue() {
    if (this.payOptionSelected === 'T') {
      this.#rateDiscount.set(this.form.controls['rateValue'].value);
      const discountValue =
        (+this.transac().saldo * this.#rateDiscount()) / 100;
      this.form.controls['discountValue'].setValue(discountValue);

      const payValue = +this.transac().saldo - discountValue;
      this.form.controls['payValue'].setValue(payValue);

      this.newSaldo.set(this.transac().saldo - (discountValue + payValue));
    } else {
      const abono = +this.form.controls['payValue'].value
      this.#rateDiscount.set(this.form.controls['rateValue'].value);
      // const discountValue =
      //   (abono * this.#rateDiscount()) / 100;
      // this.form.controls['discountValue'].setValue(discountValue);
      const discountValue =
      (abono * 100) / (100 - this.#rateDiscount()) - abono;
      this.form.controls['discountValue'].setValue(discountValue);
      this.newSaldo.set(this.transac().saldo - (discountValue + abono));
    }
  }

  calculateByDiscountValue() {
    if (this.payOptionSelected === 'T') {
      const discountValue = +this.form.controls['discountValue'].value;

      const rateValue = (discountValue / this.transac().saldo) * 100;
      this.form.controls['rateValue'].setValue(rateValue);
      this.#rateDiscount.set(discountValue);

      const payValue = +this.transac().saldo - discountValue;
      this.form.controls['payValue'].setValue(payValue);

      this.newSaldo.set(this.transac().saldo - (discountValue + payValue));
    }
  }

  calculateByPayValue() {
    this.#rateDiscount.set(this.form.controls['rateValue'].value);
    const controlPayValue = +this.form.controls['payValue'].value;
    const discountValue =
      (controlPayValue * 100) / (100 - this.#rateDiscount()) - controlPayValue;
    this.form.controls['discountValue'].setValue(discountValue);
    this.newSaldo.set(this.transac().saldo - (discountValue + controlPayValue));
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      const errors = this.getFormErrors();
      const errorProperties = [];

      for (const property in errors) {
        errorProperties.push(property);
      }

      Swal.fire(
        'Error de validación',
        `Campos: ${errorProperties.join(', ')}`,
        'error'
      );

      console.log(errors);

      return;
    }
  }

  closeDialog(): void {
    const data = null;
    this.dialogRef.close({ data });
  }
}
