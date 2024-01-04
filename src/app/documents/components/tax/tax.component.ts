import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, Optional, computed, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TaxSchemeService } from '@shared/services/tax-scheme.service';
import { initFlowbite } from 'flowbite';
import { TaxRate } from '@shared/models/tax-rate.model';
import { getObjectValues } from '@shared/helpers/get-object-values';
import { Tax } from './models/tax.model';
import { TaxScheme } from '@shared/models/tax-scheme.model';

@Component({
  selector: 'app-tax',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './tax.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxComponent implements AfterViewInit {


  private taxSchemeService = inject(TaxSchemeService);

  public selectedRates: { [key: string]: any } = {};

  public taxes: Tax[] = [];

  public taxSchemesItems = computed(()=>{
    const taxSchemas = this.taxSchemeService.taxSchemesItems();
    taxSchemas.forEach((i) => {
      i.taxRates!.map(j=>j.rate = Math.trunc(j.rate))
    });
    return taxSchemas
  });

  
  private taxSchemesService = inject(TaxSchemeService);

  private taxSchemes = computed(() => this.taxSchemesService.taxSchemesItems());

  public baseAmount: number = 0;

  constructor(
    public dialogRefItemsTax: MatDialogRef<TaxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any,
  ) {

    const { baseAmount, taxRates } = obj;
    this.baseAmount = baseAmount || 0;

    
    if (taxRates) {
      taxRates.map((i:TaxRate)=>{
        this.selectedRates[i.taxScheme.identifier] = i;
        
      })
    }

  }

  ngAfterViewInit(): void {
    initFlowbite();
  }



  selectTaxes() {
    const taxRates: TaxRate[] = [];
    const objValues: any[] = getObjectValues(this.selectedRates);

    objValues.map(i=>taxRates.push(i))

    const taxes: Tax[] = [];

    taxRates.map(i=>{

      const taxScheme: TaxScheme = this.taxSchemes().filter(
        (ts) => ts.identifier === i.tax
      )[0];
      const { taxRates, ...rest } = taxScheme
      i.taxScheme = rest;
      
      const tax: Tax = {
        rate: i.rate,
        identifier: i.tax,
        name: i.taxScheme.name,
        amount: this.baseAmount * (i.rate/100),
        baseamount: this.baseAmount
      }
      taxes.push(tax);
    })

    this.dialogRefItemsTax.close({ event: 'Cancel', data: {
      taxRates,
      taxes
    } });
    
  }

  closeDialog(): void {
    
    this.dialogRefItemsTax.close({ event: 'Cancel', data: this.selectedRates });
  }

 }

