import { TipoDocumento } from "@shared/models/tipo-documento.model";
import { Cliente } from "./cliente-model";
import { VMunicipio } from "@shared/models/v-municipio.model";

export class Tercero {
    terceroId?: number;
    tipoDocumentoId: number = 0;
    tipoRegimenId: number = 0;
    tipoPersonaId: number = 0;
    municipioId: number = 0;
    identificacion: string = '';
    digitoVerificacion: string = '';
    apellido1: string = '';
    apellido2?: string = '';
    nombre1: string = '';
    nombre2?: string = '';
    razonSocial1: string = '';
    razonSocial2?: string = '';
    direccion1: string = '';
    direccion2?: string = '';
    fechaCreacion: Date = new Date();
    paisId: number = 0;
    reteiva?: number;
    retefuente?: number;
    reteica?: number;
    porcreteica?: number;
    retefteId?: number;
    codpostal?: string = '';
    dctoivaobsequio: number = 0;
    excentoIva: number = 0;
    responsabilidadesFiscales: string = 'R-99-PN';
    isResident: number = 1;
    clientes?: Cliente[];
    tipoDocumento?: TipoDocumento
    municipio?: VMunicipio
  
    constructor(data: Partial<Tercero> = {}) {
      Object.assign(this, data);
    }
  }
  

  