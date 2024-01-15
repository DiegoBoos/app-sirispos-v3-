import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  Optional,
  computed,
  inject,
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { SearchPaymentsComponent } from '../../../customer-payments/components/search-payments/search-payments.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PipesModule } from '../../../pipes/pipes.module';
import { SelectTextDirective } from '@shared/directives/select-text.directive';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ValidatorsService } from '@shared/services/validators.service';
import { TipoDocumentoService } from '@shared/services/tipo-documento.service';
import { PaisService } from '@shared/services/pais.service';
import { VMunicipioService } from '@shared/services/v-municipio.service';
import { InputAddressDirective } from '@shared/directives/input-address.directive';
import { TipoPersonaService } from '@shared/services/tipo-persona.service';
import { TipoRegimenService } from '@shared/services/tipo-regimen.service';
import { TaxSchemeService } from '@shared/services/tax-scheme.service';
import { ResponsabilidadFiscalService } from '@shared/services/responsabilidad-fiscal.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-new-edit-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    SelectTextDirective,
    InputAddressDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './new-edit-customer.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewEditCustomerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private tipoDocumentoService = inject(TipoDocumentoService);
  private tipoPersonaService = inject(TipoPersonaService);
  private tipoRegimenService = inject(TipoRegimenService);
  private paisService = inject(PaisService);
  private municipioService = inject(VMunicipioService);
  private taxSchemeService = inject(TaxSchemeService);
  private responsabilidadFiscalService = inject(ResponsabilidadFiscalService);

  public tiposDocumento = computed(() => this.tipoDocumentoService.tiposDocumento());
  public tiposPersona = computed(() => this.tipoPersonaService.tiposPersona());
  public tiposRegimen = computed(() => this.tipoRegimenService.tiposRegimen());
  public paises = computed(() => this.paisService.paises());
  public municipios = computed(() => this.municipioService.municipios());
  public taxSchemes = computed(() => this.taxSchemeService.taxAllSchemes());
  public responsabilidadesFiscales = computed(() => this.responsabilidadFiscalService.responsabilidadesFiscales());

  public action: string = '';

  public personTypes = [
    {
      value: 'C',
      description: 'Cliente',
    },
    {
      value: 'P',
      description: 'Proveedor',
    },
    {
      value: 'A',
      description: 'Cliente y Proveedor',
    },
  ];

  public form: FormGroup = this.fb.group({
    personType: ['C', [Validators.required]], //C=Cliente, P=Proveedor, A=ClienteAndProveedor,
    identificationType: [3, [Validators.required]],
    identification: ['', [Validators.required]],
    dv: ['', [Validators.required]],
    costumerName: ['', [Validators.required]],
    tributaryIdentificationName: ['', [Validators.required]],
    electronicMail: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required]],
    paisId: [48, [Validators.required]],
    municipioId: [757, [Validators.required]],
    addressLine1: [''],
    tipoPersonaId: [2, [Validators.required]],
    tipoRegimenId: [1, [Validators.required]],
    schemeIdentifier: ['ZZ', [Validators.required]],
    responsabilidadesFiscales: [['R-99-PN'], [Validators.required]],
  });

  constructor(
    public dialogRef: MatDialogRef<SearchPaymentsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any
  ) {
    const { action } = obj;

    this.action = action;
  }

  ngOnInit(): void {
    initFlowbite();
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  getFieldError(field: string) {
    return this.validatorsService.getFieldError(this.form, field);
  }

  getFormErrors() {
    const errores: { [key: string]: any } = {};

    // Recorrer todos los controles del formulario
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);

      // Obtener los errores del control si existen
      if (control?.errors) {
        errores[controlName] = control.errors;
      }
    });

    return errores;
  }

  onSave() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log(this.getFormErrors());

      return;
    }
    console.log('GUARDAR TERCERO');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
