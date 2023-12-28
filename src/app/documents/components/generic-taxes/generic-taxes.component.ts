import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Optional, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { getObjectValues } from '@shared/helpers/get-object-values';
import { TaxRate } from '@shared/models/tax-rate.model';
import { TaxSchemeService } from '@shared/services/tax-scheme.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-generic-taxes',
  standalone: true,
  imports: [
    CommonModule,MatDialogModule, FormsModule, NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './generic-taxes.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTaxesComponent { 

  selectedRates: { [key: string]: any } = {};

  private taxSchemeService = inject(TaxSchemeService);
  public baseAmount: number = 0;

  public taxSchemesItems = computed(()=>{
    const taxSchemas = this.taxSchemeService.taxSchemesGenerics();
    taxSchemas.forEach((i) => {
      i.taxRates.map(j=>j.rate =  Math.trunc(j.rate * 10) / 10);
    })
    return taxSchemas
  });

  constructor(
    public dialogRef: MatDialogRef<GenericTaxesComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any,
  ) {

    const { baseAmount, taxRates } = obj;
    this.baseAmount = baseAmount || 0;

    if (taxRates) {
      taxRates.map((i:TaxRate)=>{
        if (i.id!.length<3) {
          this.selectedRates[i.taxScheme.identifier] = i.rate;
        } else {
          this.selectedRates[i.taxScheme.identifier] = i;
        }
      })
    }
  }

  selectTaxes() {
    const taxRates: TaxRate[] = [];
    const objValues: any[] = getObjectValues(this.selectedRates);

    
    objValues.map(i=>taxRates.push(i))

    this.dialogRef.close({ event: 'Cancel', data: {
      taxRates
    } });
    
  }

  onBlur(event: any, identifier: string) {
    
    // Obtén el valor actual del input
   
    let inputValue = event.target.value;

    if (inputValue) {
      this.selectedRates[identifier] = {id: identifier, tax: identifier, description: '', rate: +inputValue};

    }

  }
  

  closeDialog(): void {
    
    this.dialogRef.close({ event: 'Cancel', data: this.selectedRates });
  }
}
