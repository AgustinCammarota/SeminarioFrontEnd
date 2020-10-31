import {Categoria} from './categoria';

export interface PageProducto {
  content: Producto[];
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

export interface Producto {
  nombre: string;
  precio: string;
  cantidad: number;
  descripcion: string;
  categoria: Categoria;
  fechaCreate: Date;
  id?: number;
  archivoHashCode?: number;
  foto?: string;
  nombreFoto?: any;
}

export class Producto {
  constructor(public nombre: string,
              public precio: string,
              public cantidad: number,
              public descripcion: string,
              public categoria: Categoria,
              public fechaCreate: Date,
              public id?: number,
              public archivoHashCode?: number,
              public foto?: string,
              public nombreFoto?: any) {}
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
