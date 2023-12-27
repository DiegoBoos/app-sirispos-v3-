import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { SearchPaymentsComponent } from '../../../customer-payments/components/search-payments/search-payments.component';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DocumentItem } from './models/document-item.model';
import { VPagoCliDetalle } from '../../../customer-payments/models/v-pagocli-detalle.model';
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
import { TotalsInvoice } from '@shared/interfaces/totals-invoice.interface';

import { numberToWords } from '../../../shared/helpers/number-to-words';
import { SearchUnitCodeComponent } from '@shared/components/search-unit-code/search-unit-code.component';
import { UnitCode } from '@shared/models/unit-code.model';
import { initFlowbite } from 'flowbite';
import { AllowanceChargueComponent } from '../allowance-chargue/allowance-chargue.component';
import { AllowanceChargue } from '../allowance-chargue/models/allowance-charge.model';
import { TaxComponent } from '../tax/tax.component';
import { TaxRate } from '@shared/models/tax-rate.model';
import { ItemTax } from './interfaces/item-tax.interface';
import { getObjectValues } from '@shared/helpers/get-object-values';
import { TaxScheme } from '@shared/models/tax-scheme.model';
import { TaxSchemeService } from '@shared/services/tax-scheme.service';

@Component({
  selector: 'app-document-items',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchPaymentsComponent,
    MatDialogModule,
    NgxMaskDirective,
    SearchUnitCodeComponent,
  ],
  providers: [provideNgxMask()],
  templateUrl: './document-items.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentItemsComponent implements AfterViewInit {
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  public form!: FormGroup;
  private validatorsService = inject(ValidatorsService);
  private taxSchemesService = inject(TaxSchemeService);

  private taxSchemes = computed(()=>this.taxSchemesService.taxSchemesItems())

  @Input({ required: true }) clienteId!: string;

  @Output() public emitTotalsInvoiceEvent = new EventEmitter<TotalsInvoice>();

  #documentItems = signal<DocumentItem[]>([]);

  private unitCodeDefault: UnitCode = {
    code: '94',
    description: 'Unidad',
  };

  public totals = computed(() => {
    let lineCount: number = 0;
    let subTotal: number = 0;
    let allowanceChangueTotal: number = 0;
    const itemTax: ItemTax[] = [];

    this.#documentItems().map((i: DocumentItem) => {
      lineCount++;
      const itemSubtotal = (+i.quantity * +i.unitPrice);
      const itemAllowanceChangueTotal = (+i.quantity * i.totalAllowanceChargue);
      subTotal += itemSubtotal;
      allowanceChangueTotal += itemAllowanceChangueTotal;
      i.taxRates?.map((taxRate: TaxRate) => {
        const taxScheme: TaxScheme = this.taxSchemes().filter(ts=>ts.identifier===taxRate.tax)[0];
        return itemTax.push({ baseAmount: (itemSubtotal + itemAllowanceChangueTotal), taxRate, taxScheme, totalRate: 0})
      });
    });

    // Objeto para almacenar los resultados agrupados
    const groupedByTax: ItemTax = itemTax.reduce((result: any, current) => {
      const tax = current.taxRate.tax;
      const taxValue = (+current.baseAmount) * (+current.taxRate.rate/100);
      // Si el grupo aún no existe, créalo con el valor actual
      if (!result[tax]) {
        result[tax] = { taxRate: current.taxRate, taxScheme: current.taxScheme, totalRate: taxValue };
      } else {
        // Si ya existe, simplemente suma el valor actual al totalRate
        result[tax].totalRate += taxValue;
      }

      return result;
    }, {});

    const objValues: any[] = getObjectValues(groupedByTax);
    const itemsTax: any[] = [];
    objValues.map(i=>itemsTax.push(i))
    
    let taxTotal = 0;
    
    itemsTax.map(i=>taxTotal += i.totalRate)

    const total = subTotal + allowanceChangueTotal + taxTotal;



    const totalInWords = numberToWords(total, {
      plural: 'Pesos M/CTE',
      singular: 'Peso M/CTE',
      centPlural: 'centavos',
      centSingular: 'centavo',
    });

    const totalsInvoice: TotalsInvoice = {
      lineCount,
      subTotal,
      allowanceChangueTotal,
      itemsTax,
      total,
      totalInWords,
    };

    return totalsInvoice;
  });

  constructor() {
    this.creatForm();
    this.items.valueChanges.subscribe((itemsValues: DocumentItem[]) => {
      this.#documentItems.set([]);
      itemsValues.map((i: DocumentItem) => {
        this.#documentItems.update((items) => {
          items.push(i);
          return items;
        });
      });
    });
  }
  ngAfterViewInit(): void {
    initFlowbite();
  }

  creatForm() {
    this.form = this.fb.group({
      // fName: [null],
      // lName: [null],
      // addresses: this.addressForm(),
      items: this.fb.array([]),
    });
  }

  // addressForm(){
  //   return this.fb.group(
  //     {
  //       address1: [null],
  //       address2: [null],
  //       country: [null],
  //       state: [null]
  //     }
  //   )
  // }

  // get addresses(){
  // return this.form.get("addresses") as FormGroup;
  // }

  isValidField(form: any, field: string) {
    return this.validatorsService.isValidField(form, field);
  }

  getFieldError(form: any, field: string) {
    return this.validatorsService.getFieldError(form, field);
  }

  itemForm(data?: DocumentItem): FormGroup {
    return this.fb.group({
      consecutive: [null],
      description: [data ? data.description : '', Validators.required],
      standardItemIdentification: [
        data ? data.standardItemIdentification : '',
        Validators.required,
      ],
      unitCode: [
        data ? data.unitCode : this.unitCodeDefault.code,
        Validators.required,
      ],
      quantity: [data ? data.quantity : 1, Validators.required],
      unitPrice: [data ? data.unitPrice : 0, Validators.required],
      totalAllowanceChargue: 0,
      taxRates: [],
      allowanceChargues: [],
      total: [data ? data.total : 0, Validators.required],
      descriptionUnitCode: [
        data ? data.descriptionUnitCode : this.unitCodeDefault.description,
      ],
    });
  }

  get items() {
    return this.form!.get('items') as FormArray;
  }

  addItem(data?: DocumentItem): void {
    const addData: DocumentItem = data
      ? data
      : {
          consecutive: this.items.length + 1,
          description: '',
          standardItemIdentification: '',
          unitCode: this.unitCodeDefault.code,
          quantity: 1,
          unitPrice: 0,
          totalAllowanceChargue: 0,
          taxRates: [],
          allowanceChargues: [],
          total: 0,
          descriptionUnitCode: this.unitCodeDefault.description,
        };
    this.items.push(this.itemForm(addData));
    // Forzar detección de cambios
    this.cd.detectChanges();
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    // this.emitTotalsInvoiceEvent.emit(this.totals());
    this.cd.detectChanges();
  }

  calculateTotal(index: number) {
    const itemControl = this.items.at(index);
    if (itemControl) {
      const documentItem: DocumentItem = itemControl.value;
      
      const quantity = +documentItem.quantity;
      const unitPrice = +documentItem.unitPrice;
      const allowanceChargue = documentItem.totalAllowanceChargue
        ? +documentItem.totalAllowanceChargue
        : 0;

      const subtotalItemBeforeTaxes: number = unitPrice + allowanceChargue;

      let totalTaxes = 0;
      documentItem.taxRates?.map(
        (i) => (totalTaxes += subtotalItemBeforeTaxes * (i.rate / 100))
      );

      const totalItem = quantity * (subtotalItemBeforeTaxes + totalTaxes);

      this.updateControlValue(index, 'total', totalItem);

      this.emitTotalsInvoiceEvent.emit(this.totals());
    }
  }

  calculateFromTotal(index: number) {
    const itemControl = this.items.at(index);
    if (itemControl) {
      const documentItem: DocumentItem = itemControl.value;
      const totalItem = +documentItem.total;
      const quantity = +documentItem.quantity;
      const allowanceChargue = documentItem.totalAllowanceChargue
        ? +documentItem.totalAllowanceChargue
        : 0;
      const unitPrice = (totalItem + allowanceChargue * -1) / quantity;
      this.updateControlValue(index, 'unitPrice', unitPrice);
      this.emitTotalsInvoiceEvent.emit(this.totals());
    }
  }

  updateControlValue(index: number, property: string, newValue: any) {
    const itemControl = this.items.at(index);
    if (itemControl) {
      itemControl.get(property)?.setValue(newValue);
    }
  }

  loadUnitCode(index: number): void {
    const dialogRef = this.dialog.open(SearchUnitCodeComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { data } = result;

        if (data) {
          const unitCode: UnitCode = data;
          this.updateControlValue(index, 'unitCode', unitCode.code);
          this.updateControlValue(
            index,
            'descriptionUnitCode',
            unitCode.description
          );
          this.cd.detectChanges();
        }
      }
    });
  }

  loadTaxes(index: number): void {
    const dialogRef = this.dialog.open(TaxComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { data } = result;

        if (data) {
          const { taxRates } = data;
          if (taxRates) {
            this.updateControlValue(index, 'taxRates', taxRates);
            this.calculateTotal(index);
          }
          this.cd.detectChanges();
        }
      }
    });
  }

  loadAllowanceChargues(index: number): void {
    const itemControl = this.items.at(index);
    if (itemControl) {
      const documentItem: DocumentItem = itemControl.value;
      const baseAmount = documentItem.unitPrice;
      const allowanceChargues: AllowanceChargue[] =
        documentItem.allowanceChargues!;
      const dialogRef = this.dialog.open(AllowanceChargueComponent, {
        data: { baseAmount, allowanceChargues },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const { data } = result;

          if (data) {
            const { allowanceChargues, total } = data;

            if (total) {
              this.updateControlValue(
                index,
                'allowanceChargues',
                allowanceChargues
              );
              this.updateControlValue(index, 'totalAllowanceChargue', total);
              this.calculateTotal(index);
            }
            this.cd.detectChanges();
          }
        }
      });
    }
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(SearchPaymentsComponent, {
      data: { data },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { data } = result;

        const payments: VPagoCliDetalle[] = data;

        let i = 0;
        payments.forEach((element) => {
          const documentItem: DocumentItem = new DocumentItem();
          documentItem.consecutive = i;
          documentItem.quantity = 1;
          documentItem.unitPrice = +element.descuento;
          documentItem.unitCode = this.unitCodeDefault.code;
          documentItem.descriptionUnitCode = this.unitCodeDefault.description;
          documentItem.description = `Descuento por recibo No. ${
            element.recibo
          } (${format(element.fechapago, 'dd-MMM-yyyy', { locale: es })})`;
          documentItem.standardItemIdentification = element.recibo;
          documentItem.total = documentItem.quantity * documentItem.unitPrice;

          this.addItem(documentItem);

          i++;
        });

        this.emitTotalsInvoiceEvent.emit(this.totals());
        // for (let i = 0; i < payments.length; i++) {
        //   const documentItem: DocumentItem = new DocumentItem();
        //   documentItem.consecutive = i;
        //   documentItem.nquantity = 1;
        //   documentItem.nunitprice = +payments[i].descuento;
        //   documentItem.sdescription = `Descuento por recibo No. ${payments[i].recibo} (${format(payments[i].fechapago, 'dd-MMM-yyyy', { locale: es })})`;
        //   documentItem.sstandarditemidentification = payments[i].recibo;
        //   documentItem.ntotal = documentItem.nquantity * documentItem.nunitprice;

        //   this.addItem(documentItem);

        // }
      }
    });
  }
}
