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
  id?: number;
  nombre: string;
  precio: string;
  cantidad: string;
  descripcion: string;
  archivo: any;
  estado?: string;
  fechaCreate?: string;
}

export class Producto {
  constructor(public nombre: string,
              public precio: string,
              public cantidad: string,
              public descripcion: string,
              public archivo: any,
              public estado?: string,
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
