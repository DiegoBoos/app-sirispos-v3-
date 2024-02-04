import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
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
import { SearchPaymentsComponent } from '../../../accounts-receivable/components/search-payments/search-payments.component';
import {
  FormArray,
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
import { TipoPrecioService } from '@shared/services/tipo-precio.service';
import { VendedorService } from '@shared/services/vendedor.service';
import { SettingService } from '../../../setting/setting.service';
import { ZonaService } from '@shared/services/zona.service';
import { ClientAllowance } from '../../models/client-allowance.model';
import { ReteFuenteService } from '@shared/services/retefuente.service';
import { dvCalculate } from '@shared/helpers/dv-calculate';
import { CustomerService } from '../../customer.service';
import { Cliente } from '../../models/cliente-model';
import Swal from 'sweetalert2';
import { VCliente } from '../../models/v-cliente.model';
import { Customer } from '../../interfaces/customer.interface';

@Component({
  selector: 'app-new-edit-customer',
  standalone: true,
  imports: [
    CommonModule,
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
export class NewEditCustomerComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private tipoDocumentoService = inject(TipoDocumentoService);
  private tipoPersonaService = inject(TipoPersonaService);
  private tipoRegimenService = inject(TipoRegimenService);
  private paisService = inject(PaisService);
  private municipioService = inject(VMunicipioService);
  private taxSchemeService = inject(TaxSchemeService);
  private responsabilidadFiscalService = inject(ResponsabilidadFiscalService);
  private tipoPrecioService = inject(TipoPrecioService);
  private vendedorService = inject(VendedorService);
  public settingService = inject(SettingService);
  public zonaService = inject(ZonaService);
  public retefuenteService = inject(ReteFuenteService);
  public customerService = inject(CustomerService);

  public tiposDocumento = computed(() =>
    this.tipoDocumentoService.tiposDocumento()
  );
  public tiposPersona = computed(() => this.tipoPersonaService.tiposPersona());
  public tiposRegimen = computed(() => this.tipoRegimenService.tiposRegimen());
  public paises = computed(() => this.paisService.paises());
  public municipios = computed(() => this.municipioService.municipios());
  public taxSchemes = computed(() => this.taxSchemeService.taxAllSchemes());
  public responsabilidadesFiscales = computed(() =>
    this.responsabilidadFiscalService.responsabilidadesFiscales()
  );
  public tiposPrecio = computed(() => this.tipoPrecioService.tiposPrecio());
  public vendedores = computed(() => this.vendedorService.vendedores());
  public zonas = computed(() => this.zonaService.zonas());
  public retefuentes = computed(() => this.retefuenteService.retefuentes());

  public action: string = '';

  public isRetefuente: boolean = false;
  public isReteICA: boolean = false;

  public tipoPersonaId: number = 2;
  private vCliente: VCliente = new VCliente();

  // public personTypes = [
  //   {
  //     value: 'C',
  //     description: 'Cliente',
  //   },
  //   {
  //     value: 'P',
  //     description: 'Proveedor',
  //   },
  //   {
  //     value: 'A',
  //     description: 'Cliente y Proveedor',
  //   },
  // ];

  public form: FormGroup = this.fb.group(
    {
      // personType: ['C', [Validators.required]], //C=Cliente, P=Proveedor, A=ClienteAndProveedor,
      id: [null],
      identificationType: [3, [Validators.required]],
      identification: ['', [Validators.required]],
      dv: ['', [Validators.required]],
      customerName: ['', [Validators.required]],
      apellido1: [''],
      apellido2: [''],
      nombre1: [''],
      nombre2: [''],
      tributaryIdentificationName: [''],
      electronicMail: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      paisId: [48, [Validators.required]],
      municipioId: [757, [Validators.required]],
      addressLine1: [''],
      tipoPersonaId: [2, [Validators.required]],
      tipoRegimenId: [1, [Validators.required]],
      schemeIdentifier: ['ZZ', [Validators.required]],
      responsabilidadesFiscales: [['R-99-PN'], [Validators.required]],
      plazoCredito: [0],
      bloqueoMora: [0],
      cupoCredito: [0],
      tipoPrecioId: [0, [Validators.required]],
      vendedorId: [1, [Validators.required]],
      zonaId: [1, [Validators.required]],
      aplicaFE: [1, [Validators.required]],
      activo: [1, [Validators.required]],
      isResident: [1, [Validators.required]],
      isReteFuente: [0, [Validators.required]],
      isReteIVA: [0, [Validators.required]],
      isReteICA: [0, [Validators.required]],
      retefteId: [null],
      porcreteica: [0],
      discountParams: [[]],
    },
    {
      validators: [
        this.validatorsService.tipoPersonaValidator(
          'tipoPersonaId',
          'apellido1',
          'nombre1',
          'tributaryIdentificationName'
        ),
      ],
    }
  );

  public formDescuentos!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SearchPaymentsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public obj: any
  ) {
    const { action, customerId } = obj;

    if (customerId) {
      this.customerService.findById(customerId).subscribe((resp) => {
        if (resp) {
          const cliente: Cliente = resp;

          const responsabilidadesFiscales =
            cliente.tercero?.responsabilidadesFiscales.split(',');

          this.form.controls['identificationType'].setValue(
            cliente.tercero?.tipoDocumentoId
          );
          this.form.controls['identification'].setValue(
            cliente.tercero?.identificacion
          );
          this.form.controls['dv'].setValue(
            cliente.tercero?.digitoVerificacion
          );
          this.form.controls['id'].setValue(customerId);
          this.form.controls['customerName'].setValue(cliente.nombreComercial);
          this.form.controls['apellido1'].setValue(cliente.tercero?.apellido1);
          this.form.controls['apellido2'].setValue(cliente.tercero?.apellido2);
          this.form.controls['nombre1'].setValue(cliente.tercero?.nombre1);
          this.form.controls['nombre2'].setValue(cliente.tercero?.nombre2);
          this.form.controls['tributaryIdentificationName'].setValue(
            cliente.tercero?.razonSocial1
          );
          this.form.controls['electronicMail'].setValue(cliente.email);
          this.form.controls['telephone'].setValue(cliente.telefono);
          this.form.controls['paisId'].setValue(cliente.tercero?.paisId);
          this.form.controls['municipioId'].setValue(
            cliente.tercero?.municipioId
          );
          this.form.controls['addressLine1'].setValue(
            cliente.tercero?.direccion1
          );
          this.form.controls['tipoPersonaId'].setValue(
            cliente.tercero?.tipoPersonaId
          );
          this.form.controls['tipoRegimenId'].setValue(
            cliente.tercero?.tipoRegimenId
          );
          this.form.controls['schemeIdentifier'].setValue('ZZ');
          this.form.controls['responsabilidadesFiscales'].setValue(
            responsabilidadesFiscales
          );
          this.form.controls['plazoCredito'].setValue(cliente.plazoCredito);
          this.form.controls['bloqueoMora'].setValue(cliente.diasBloqueoMora);
          this.form.controls['cupoCredito'].setValue(cliente.cupoCredito);
          this.form.controls['tipoPrecioId'].setValue(cliente.tipoPrecioId);
          this.form.controls['vendedorId'].setValue(cliente.vendedorId);
          this.form.controls['zonaId'].setValue(cliente.zonaId);
          this.form.controls['aplicaFE'].setValue(cliente.aplicaFe);
          this.form.controls['activo'].setValue(cliente.activo);
          this.form.controls['isResident'].setValue(
            cliente.tercero?.isResident
          );
          this.form.controls['isReteFuente'].setValue(
            cliente.tercero?.retefuente
          );
          this.form.controls['isReteIVA'].setValue(cliente.tercero?.reteiva);
          this.form.controls['isReteICA'].setValue(cliente.tercero?.reteica);
          this.form.controls['retefteId'].setValue(cliente.tercero?.retefteId);
          this.form.controls['porcreteica'].setValue(
            cliente.tercero?.porcreteica
          );
          this.form.controls['discountParams'].setValue(cliente.discountParams);

          cliente.discountParams?.map(i=>{
            const item: ClientAllowance = {
              clientAllowanceId: i.id,
              days: i.days!,
              rate: i.rate!
            };
            this.addItem(item)
          })
          this.changueRetefuente();
        }
      });
    }

    this.action = action;
    this.creatForm();
  }
  ngAfterViewInit(): void {
    this.form.controls['tipoPrecioId'].setValue(
      this.settingService.seeting().tipoprecio_id
    );
  }

  ngOnInit(): void {
    initFlowbite();
  }

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.form, field);
  }

  isValidFieldFormArray(form: any, field: string) {
    return this.validatorsService.isValidField(form, field);
  }

  getFieldError(field: string) {
    return this.validatorsService.getFieldError(this.form, field);
  }

  getFieldErrorFormArray(form: any, field: string) {
    return this.validatorsService.getFieldError(form, field);
  }

  itemForm(data?: ClientAllowance): FormGroup {
    return this.fb.group({
      clientAllowanceId: [null],
      days: [data ? data.days : 30, Validators.required],
      rate: [data ? data.rate : 0, Validators.required],
    });
  }

  creatForm() {
    this.formDescuentos = this.fb.group({
      items: this.fb.array([]),
    });
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    // this.#allowanceChargues.update((values) => {
    //   values.splice(index,1);
    //   return values;
    // })
    // this.calculateSubtotal();
  }

  get items() {
    return this.formDescuentos!.get('items') as FormArray;
  }

  getFormErrors() {
    const errores: { [key: string]: any } = {};

    // Recorrer todos los controles del formulario
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);

      // Obtener los errores del control si existen
      if (control?.errors) {
        errores[controlName] = control.errors;
      }
    });

    return errores;
  }

  onChangeTipoPersona(e: any) {
    this.tipoPersonaId = +e.value;
  }

  onSave() {
    this.form.controls['discountParams'].setValue(this.formDescuentos.value);
    if (this.tipoPersonaId !== 2) {
      this.form.controls['apellido1'].setValue('');
      this.form.controls['apellido2'].setValue('');
      this.form.controls['nombre1'].setValue('');
      this.form.controls['nombre2'].setValue('');
    } else {
      this.form.controls['tributaryIdentificationName'].setValue('');
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      const errors = this.getFormErrors();
      const errorProperties = [];

      for (const property in errors) {
        errorProperties.push(property);
      }

      Swal.fire(
        'Error de validación',
        `Campos: ${errorProperties.join(', ')}`,
        'error'
      );

      console.log(errors);

      return;
    }

    const customer: Customer = this.form.value;

    if (!customer.id) {
      this.customerService.create(customer).subscribe((resp: any) => {
        if (resp.ok) {
          Swal.fire('Transacción exitosa.','Cliente creado satisfactoriamente.','success');
          this.vCliente = resp.data;
          this.closeDialog();
        }
        
      });
    } else {

      this.customerService.update(customer).subscribe((resp: any) => {
        if (resp.ok) {
          Swal.fire('Transacción exitosa.','Cliente actualizado satisfactoriamente.','success');
          // this.vCliente = resp.data;
          this.closeDialog();
        }
        
      });
    }


  }

  dvCalc() {
    const iden = this.form.controls['identification'].value;
    const dv = dvCalculate(iden);
    this.form.controls['dv'].setValue(dv);
  }

  changueRetefuente() {
    this.isRetefuente = this.form.controls['isReteFuente'].value;
    if (!this.isRetefuente) {
      this.form.controls['retefteId'].setValue(null);
    }
  }

  changueReteICA() {
    this.isReteICA = this.form.controls['isReteICA'].value;
    if (!this.isReteICA) {
      this.form.controls['porcreteica'].setValue(0);
    }
  }

  addItem(data?: ClientAllowance): void {
    const addData: ClientAllowance = data
      ? data
      : {
          clientAllowanceId: '',
          days: 0,
          rate: 0,
        };
    this.items.push(this.itemForm(addData));
    // this.#allowanceChargues.update((values) => {
    //   values.push(addData);
    //   return values;
    // })
  }

  closeDialog(): void {
    const data = this.vCliente;
    this.dialogRef.close({data});
  }
}
