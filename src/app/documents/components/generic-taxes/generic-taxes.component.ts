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

  selectedRates: { [key: string]: TaxRate } = {};

  public taxSchemesGenerics = computed(() => {
    const taxSchemas = this.taxSchemeService.taxSchemesGenerics();
    taxSchemas.forEach((i) => {
      i.taxRates.map((j) => (j.rate = Math.trunc(j.rate * 10) / 10));
    });
    return taxSchemas;
  });

  public baseAmount: number = 0;

  constructor(
    public dialogRef: MatDialogRef<GenericTaxesComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any
  ) {

    const { baseAmount, taxRates } = obj;
    this.baseAmount = baseAmount || 0;

    
    
    if (taxRates) {
      taxRates.map((i: TaxRate) => {
        
        this.selectedRates[i.taxScheme.identifier] = i;
        
        // if (i.id!.length < 3) {
          // } else {
            //   this.selectedRates[i.tax] = i;
            // }
          });
        }
        console.log(this.selectedRates);
        
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  selectTaxes() {
    const taxRates: TaxRate[] = [];
    const objValues: any[] = getObjectValues(this.selectedRates);

    console.log(this.selectedRates);

    objValues.map((i) => {
      const taxScheme: TaxScheme = this.taxSchemesGenerics().filter(
        (ts) => ts.identifier === i.tax
      )[0];

      const taxGeneric: TaxRate = {
        id: i.id,
        tax: i.tax,
        description: i.description,
        rate: i.rate,
        taxScheme,
      };
      taxRates.push(taxGeneric);
    });
    // objValues.map(i=>taxRates.push(i))

    this.dialogRef.close({
      event: 'Cancel',
      data: {
        taxRates,
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
        rate: +inputValue,
        taxScheme
      };
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel', data: {} });
  }
}
