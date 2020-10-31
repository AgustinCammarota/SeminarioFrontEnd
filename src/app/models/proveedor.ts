import {Producto} from './producto';

export interface PageProveedor {
  content: Proveedor[];
  pageable: Pageable;
  totalElements: number;
  last: boolean;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Proveedor {
  nombre: string;
  email: string;
  direccion: string;
  telefono: string;
  productos: Producto[];
  fechaCreate?: string;
  id?: number;
}

export class Proveedor {
  constructor(public nombre: string,
              public email: string,
              public direccion: string,
              public telefono: string,
              public productos: Producto[],
              public fechaCreate?: string,
              public id?: number) {}
}

interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

interface Pageable {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  paged: boolean;
}
