import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Optional, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AllowanceChargue } from './models/allowance-charge.model';
import { initFlowbite } from 'flowbite';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '@shared/services/validators.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AllowanceChargueCodeService } from '@shared/services/allowance-chargue-code.service';

@Component({
  selector: 'app-allowance-chargue',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxMaskDirective,
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

  public allowanceChargueCodes = computed(()=>this.allowanceChargueCodeService.AllowanceChargueCodes());

  public total = computed(() => {
    let total: number = 0;
    this.#allowanceChargues().map((i: AllowanceChargue) => {
      total += +i.amount;
    });
  

    return total;
  });


  public baseAmount: number = 0;

  selectedAllowanceChargues: AllowanceChargue[] = [];

  constructor(
    public dialogRef: MatDialogRef<AllowanceChargueComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any,
  ) {
    this.creatForm();
    const { baseAmount } = obj;
    this.baseAmount = baseAmount || 0;

    this.items.valueChanges.subscribe((itemsValues: AllowanceChargue[]) => {
      this.#allowanceChargues.set([]);
      itemsValues.map((i: AllowanceChargue) => {
        this.#allowanceChargues.update((items) => {
          items.push(i);
          return items;
        });
      });
    });

  }
  ngAfterViewInit(): void {
    initFlowbite();
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
          baseAmount: 0,
          amount: 0,
          rate: 0,
          // descriptionUnitCode: this.unitCodeDefault.description,
        };
    this.items.push(this.itemForm(addData));
    // Forzar detección de cambios
    this.cd.detectChanges();
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
      const amount = this.baseAmount * (rate/100) ;
      this.updateControlValue(index,'amount',amount);
    }
  }

  calculateRate(index: number) {
    const itemControl = this.items.at(index);
    if (itemControl) {
      const allowanceChargue: AllowanceChargue = itemControl.value;
      const amount = +allowanceChargue.amount;
      const rate = (amount/this.baseAmount)*100;
      this.updateControlValue(index,'rate',rate);
    }
  }


  removeItem(index: number): void {
    this.items.removeAt(index);
    this.cd.detectChanges();
  }
  
  selectAllowanceChargues() {
    console.log('return');
    
  }


  closeDialog(): void {
    
    this.dialogRef.close({ event: 'Cancel', data: this.selectedAllowanceChargues });
  }

}
