import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Optional,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AllowanceChargue } from './models/allowance-charge.model';
import { initFlowbite } from 'flowbite';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidatorsService } from '@shared/services/validators.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AllowanceChargueCodeService } from '@shared/services/allowance-chargue-code.service';
import { SelectTextDirective } from '@shared/directives/select-text.directive';

@Component({
  selector: 'app-allowance-chargue',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxMaskDirective,
    SelectTextDirective
  ],
  templateUrl: './allowance-chargue.component.html',
  providers: [provideNgxMask()],
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllowanceChargueComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  public form!: FormGroup;
  private validatorsService = inject(ValidatorsService);
  private allowanceChargueCodeService = inject(AllowanceChargueCodeService);

  #allowanceChargues = signal<AllowanceChargue[]>([]);

  public allowanceChargueCodes = computed(() =>
    this.allowanceChargueCodeService.AllowanceChargueCodes()
  );

  #subtotal = signal<number>(0);

  subtotal = computed(() => this.#subtotal());

  // public subtotal = computed(() => {
  //   let total: number = 0;
  //   this.#allowanceChargues().map((i: AllowanceChargue) => {
  //     total += +i.amount;
  //   });

  //   return this.baseAmount + total;
  // });

  public baseAmount: number = 0;
  // public quantity: number = 0;

  selectedAllowanceChargues: AllowanceChargue[] = [];

  constructor(
    public dialogRef: MatDialogRef<AllowanceChargueComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any
  ) {
    this.creatForm();
    const { baseAmount, allowanceChargues } = obj;
    this.baseAmount = baseAmount || 0;
    // this.quantity = quantity || 0;

    if (allowanceChargues) {
      allowanceChargues.map((i: AllowanceChargue) => {
        this.addItem(i);
      });
    }

    // this.items.valueChanges.subscribe((itemsValues: AllowanceChargue[]) => {
    //   this.#allowanceChargues.set([]);
    //   itemsValues.map((i: AllowanceChargue) => {
    //     this.#allowanceChargues.update((items) => {
    //       items.push(i);
    //       return items;
    //     });
    //   });
    // });
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  private calculateSubtotal(): void {
    let total: number = 0;
    this.#allowanceChargues().map((i: AllowanceChargue) => {
      total += +i.amount;
    });

    this.#subtotal.set(this.baseAmount + total);
  }

  isValidField(form: any, field: string) {
    return this.validatorsService.isValidField(form, field);
  }

  getFieldError(form: any, field: string) {
    return this.validatorsService.getFieldError(form, field);
  }

  creatForm() {
    this.form = this.fb.group({
      items: this.fb.array([]),
    });
  }

  itemForm(data?: AllowanceChargue): FormGroup {
    return this.fb.group({
      code: [data ? data.code : '00', Validators.required],
      description: [data ? data.description : '', Validators.required],
      baseAmount: [data ? data.baseAmount : 0, Validators.required],
      amount: [data ? data.amount : 0, Validators.required],
      rate: [data ? data.rate : 0, Validators.required],
    });
  }

  get items() {
    return this.form!.get('items') as FormArray;
  }

  addItem(data?: AllowanceChargue): void {
    const addData: AllowanceChargue = data
      ? data
      : {
          code: '00',
          description: '',
          baseAmount: this.baseAmount,
          amount: 0,
          rate: 0,
          // descriptionUnitCode: this.unitCodeDefault.description,
        };
    this.items.push(this.itemForm(addData));
    this.#allowanceChargues.update((values) => {
      values.push(addData);
      return values;
    })
    this.calculateSubtotal();
  }

  updateControlValue(index: number, property: string, newValue: any) {
    const itemControl = this.items.at(index);
    if (itemControl) {
      itemControl.get(property)?.setValue(newValue);
    }
  }

  calculateAmount(index: number) {
    const itemControl = this.items.at(index);
    if (itemControl) {
      const allowanceChargue: AllowanceChargue = itemControl.value;
      const rate = +allowanceChargue.rate;
      const amount = this.baseAmount * (rate / 100);
      this.updateControlValue(index, 'amount', amount);
      
      this.#allowanceChargues.update((values) => {
        values[index].rate = rate;
        values[index].amount = amount;
        return values;
      })
      
      this.calculateSubtotal();
    }
  }
  
  calculateRate(index: number) {
    const itemControl = this.items.at(index);
    if (itemControl) {
      const allowanceChargue: AllowanceChargue = itemControl.value;
      const amount = +allowanceChargue.amount;
      const rate = (amount / this.baseAmount) * 100;
      this.updateControlValue(index, 'rate', rate);

      this.#allowanceChargues.update((values) => {
        values[index].rate = rate;
        values[index].amount = amount;
        return values;
      });
      this.calculateSubtotal();
    }
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.#allowanceChargues.update((values) => {
      values.splice(index,1);
      return values;
    })
    this.calculateSubtotal();
  }

  changueCode(index: number, e: any) {
    const code = e.value;

    this.#allowanceChargues.update((values) => {
      values[index].code = code;
      return values;
    });
  }


  selectAllowanceChargues() {
    this.dialogRef.close({
      event: 'Cancel',
      data: {
        allowanceChargues: this.#allowanceChargues(),
        // total: this.subtotal()
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel', data: {} });
  }
}
