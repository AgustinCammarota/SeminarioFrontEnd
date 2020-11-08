import {Provincia} from './provincia';

export interface Direccion {
  id?: number;
  departamento?: string;
  codigoPostal: number;
  calle: string;
  numero: string;
  localidad: string;
  provincia: Provincia;
}

export class Direccion {
  constructor(public codigoPostal: number,
              public calle: string,
              public numero: string,
              public localidad: string,
              public provincia: Provincia,
              public departamento?: string,
              public id?: number) {}
}
