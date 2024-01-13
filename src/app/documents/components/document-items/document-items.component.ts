import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
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

import { SearchUnitCodeComponent } from '@shared/components/search-unit-code/search-unit-code.component';
import { UnitCode } from '@shared/models/unit-code.model';
import { initFlowbite } from 'flowbite';
import { AllowanceChargueComponent } from '../allowance-chargue/allowance-chargue.component';
import { AllowanceChargue } from '../allowance-chargue/models/allowance-charge.model';
import { TaxComponent } from '../tax/tax.component';
import { TaxRate } from '@shared/models/tax-rate.model';
import { TaxScheme } from '@shared/models/tax-scheme.model';
import { TaxSchemeService } from '@shared/services/tax-scheme.service';
import { SelectTextDirective } from '@shared/directives/select-text.directive';
import { Tax } from '../tax/models/tax.model';

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
    SelectTextDirective
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

  private taxSchemes = computed(() => this.taxSchemesService.taxSchemesItems());

  @Input({ required: true }) clienteId!: string;

  @Output() public emitItemsEvent = new EventEmitter<DocumentItem[]>();

  private unitCodeDefault: UnitCode = {
    code: '94',
    description: 'Unidad',
  };

  private getAllowanceChargueTotal(
    // quantity: number,
    allowancesChargues: AllowanceChargue[]
  ): number {
    let itemAllowanceChargueTotal = 0;
    allowancesChargues?.map(
      (i) =>
        (itemAllowanceChargueTotal +=
          // quantity * (i.baseAmount * (i.rate / 100)))
         (i.baseAmount * (i.rate / 100)))
    );
    return itemAllowanceChargueTotal;
  }

  constructor() {
    this.creatForm();
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
      taxes: [],
      allowanceChargues: [],
      userTotal: 0,
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

    const items: DocumentItem[] = this.items.value;

    const searchItem = items.filter(i=>i.standardItemIdentification === data?.standardItemIdentification);

    if (searchItem.length === 0 ) {

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
            taxes: [],
            allowanceChargues: [],
            userTotal: 0,
            total: 0,
            descriptionUnitCode: this.unitCodeDefault.description,
          };
      this.items.push(this.itemForm(addData));
  
      this.emitItems();
  
      // Forzar detección de cambios
      this.cd.detectChanges();
    }
    

  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    // this.emitItemsEvent.emit(this.#documentItems());
    this.emitItems();
    // Forzar detección de cambios
    this.cd.detectChanges();
  }

  calculateTotal(index: number) {
    const itemControl = this.items.at(index);
    if (itemControl) {
      const documentItem: DocumentItem = itemControl.value;
      const quantity = +documentItem.quantity;
      const unitPrice = +documentItem.unitPrice;

      documentItem.allowanceChargues?.map((j) => {
        j.baseAmount = unitPrice;
        j.amount = j.baseAmount * (j.rate / 100);
      });

      documentItem.totalAllowanceChargue = this.getAllowanceChargueTotal(
        // quantity,
        documentItem.allowanceChargues!
      );

      this.updateControlValue(
        index,
        'totalAllowanceChargue',
        documentItem.totalAllowanceChargue * quantity
      );

      const subtotalItemBeforeTaxes: number =
        unitPrice + documentItem.totalAllowanceChargue;

      let totalTaxes = 0;
      documentItem.taxRates?.map(
        (i) => (totalTaxes += subtotalItemBeforeTaxes * (i.rate / 100))
      );

      const totalItem = quantity * (subtotalItemBeforeTaxes + totalTaxes);

      this.updateControlValue(index, 'userTotal', subtotalItemBeforeTaxes * quantity);
      this.updateControlValue(index, 'total', totalItem);

      this.emitItems();
    }
  }

  calculateFromTotal(index: number) {
    const itemControl = this.items.at(index);
    if (itemControl) {
      const documentItem: DocumentItem = itemControl.value;
      const totalItem = +documentItem.total;
      const quantity = +documentItem.quantity;
      const unitPrice = totalItem / quantity;
      this.updateControlValue(index, 'unitPrice', unitPrice);
      this.calculateTotal(index);
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
    const itemControl = this.items.at(index);
    if (itemControl) {
      const documentItem: DocumentItem = itemControl.value;
      const allowanceChargue = this.getAllowanceChargueTotal(
        // +documentItem.quantity,
        documentItem.allowanceChargues!
      );

      const baseAmount = +documentItem.unitPrice + allowanceChargue;
      const taxes: Tax[] = documentItem.taxes!;
      const taxRates: TaxRate[] = documentItem.taxRates!;

      const dialogRef = this.dialog.open(TaxComponent, {
        data: { baseAmount, taxes, taxRates },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const { data } = result;

          if (data) {
            const { taxRates, taxes } = data;

            taxRates?.map((taxRate: TaxRate) => {
              const taxScheme: TaxScheme = this.taxSchemes().filter(
                (ts) => ts.identifier === taxRate.tax
              )[0];
              const { taxRates, ...rest } = taxScheme
              taxRate.taxScheme = rest;
            });

            if (taxRates) {
              this.updateControlValue(index, 'taxRates', taxRates);
              this.updateControlValue(index, 'taxes', taxes);
              this.calculateTotal(index);
            }
            this.cd.detectChanges();
          }
        }
      });
    }
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
            const { allowanceChargues } = data;

            if (allowanceChargues) {
              this.updateControlValue(
                index,
                'allowanceChargues',
                allowanceChargues
              );
            //   this.updateControlValue(index, 'totalAllowanceChargue', total * documentItem.quantity);
            }
            this.calculateTotal(index);
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
          documentItem.description = `Descuento por factura ${element.dcto} - recibo No. ${
            element.recibo
          } (${format(element.fechapago, 'dd-MMM-yyyy', { locale: es })})`;
          documentItem.standardItemIdentification = `${element.dcto}-${element.recibo}`;
          documentItem.total = documentItem.quantity * documentItem.unitPrice;

          this.addItem(documentItem);

          i++;
        });
      }
    });
  }

  emitItems() {
    const documentItems: DocumentItem[] = this.items.value;
    this.emitItemsEvent.emit(documentItems);
  }
}
