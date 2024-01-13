import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  Optional,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { getObjectValues } from '@shared/helpers/get-object-values';
import { TaxRate } from '@shared/models/tax-rate.model';
import { TaxScheme } from '@shared/models/tax-scheme.model';
import { TaxSchemeService } from '@shared/services/tax-scheme.service';
import { initFlowbite } from 'flowbite';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Tax } from '../tax/models/tax.model';

@Component({
  selector: 'app-generic-taxes',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './generic-taxes.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTaxesComponent implements AfterViewInit {
  private taxSchemeService = inject(TaxSchemeService);

  selectedRates: { [key: string]: any } = {};

  public taxSchemesGenerics = computed(() => {
    const taxSchemas = this.taxSchemeService.taxSchemesGenerics();
    taxSchemas.forEach((i) => {
      i.taxRates!.map((j) => (j.rate = Math.trunc(j.rate * 10) / 10));
    });
    return taxSchemas;
  });

  public baseAmount: number = 0;

  private taxSchemesService = inject(TaxSchemeService);

  private taxSchemes = computed(() => this.taxSchemesService.taxSchemesGenerics());


  constructor(
    public dialogRef: MatDialogRef<GenericTaxesComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any
  ) {
    const { baseAmount, taxRates } = obj;
    this.baseAmount = baseAmount || 0;

    if (taxRates) {
      taxRates.map((i: TaxRate) => {
        this.selectedRates[i.taxScheme.identifier] = i;
      });
    }
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  selectTaxes() {
    const taxRates: TaxRate[] = [];
    const objValues: any[] = getObjectValues(this.selectedRates);

    
    objValues.map((i) => taxRates.push(i));
    
    const taxesGenerics: Tax[] = [];

    taxRates.map(i=>{

      const taxScheme: TaxScheme = this.taxSchemes().filter(
        (ts) => ts.identifier === i.tax
      )[0];
      const { taxRates, ...rest } = taxScheme
      i.taxScheme = rest;

      let amount = this.baseAmount * (i.rate/100);

      //Manejo ReteIca
      if (i.tax === '07'){
        amount = this.baseAmount * (i.rate/1000);
      } 
        
      
      const tax: Tax = {
        rate: i.rate,
        identifier: i.tax,
        name: i.taxScheme.name,
        amount,
        baseAmount: this.baseAmount
      }
      taxesGenerics.push(tax);
    })

    this.dialogRef.close({
      event: 'Cancel',
      data: {
        taxRates,
        taxesGenerics
      },
    });

  }

  onBlur(event: any, identifier: string) {
    // Obtén el valor actual del input

    let inputValue = event.target.value;

    const taxScheme: TaxScheme = this.taxSchemesGenerics().filter(
      (ts) => ts.identifier === identifier
    )[0];

    if (inputValue) {
      this.selectedRates[identifier] = {
        id: identifier,
        tax: identifier,
        description: '',
        rate: +inputValue, //Para manejos de ReteICA
        taxScheme,
      };
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel', data: {} });
  }
}
