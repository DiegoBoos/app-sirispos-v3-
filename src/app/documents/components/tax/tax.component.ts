import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, Optional, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TaxSchemeService } from '@shared/services/tax-scheme.service';
import { initFlowbite } from 'flowbite';
import { TaxRate } from '@shared/models/tax-rate.model';
import { getObjectValues } from '@shared/helpers/get-object-values';
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

  selectedRates: { [key: string]: any } = {};

  public taxSchemesItems = computed(()=>{
    const taxSchemas = this.taxSchemeService.taxSchemesItems();
    taxSchemas.forEach((i) => {
      i.taxRates.map(j=>j.rate = Math.trunc(j.rate))
    })
    return taxSchemas
  });



  public baseAmount: number = 0;

  constructor(
    public dialogRef: MatDialogRef<TaxComponent>,
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

    this.dialogRef.close({ event: 'Cancel', data: {
      taxRates
    } });
    
  }

  closeDialog(): void {
    
    this.dialogRef.close({ event: 'Cancel', data: this.selectedRates });
  }

 }

