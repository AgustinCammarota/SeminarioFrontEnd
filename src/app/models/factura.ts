
export class Factura {
  constructor(public numeracion: string,
              public createAt?: string,
              public nombreEmpresa?: string,
              public domicilioFiscal?: string,
              public pais?: string,
              public telefonoAtencion?: string,
              public telefonoPersonal?: string,
              public email?: string) {}
}

export interface Factura {
  numeracion: string;
  createAt?: string;
  nombreEmpresa?: string;
  domicilioFiscal?: string;
  pais?: string;
  telefonoAtencion?: string;
  telefonoPersonal?: string;
  email?: string;
}
