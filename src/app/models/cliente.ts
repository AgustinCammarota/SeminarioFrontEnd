export interface PageCliente {
  content: Cliente[];
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

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  dni: string;
  telefono: string;
  fechaCreate: string;
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


