import {Cliente} from './cliente';
import {Producto} from './producto';
import {Direccion} from './direccion';
import {Factura} from './factura';

export interface PagePedido {
  content: Pedido[];
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

export interface Pedido {
  id?: number;
  observacion?: string;
  createAt?: string;
  descripcion: string;
  formaPago: string;
  cliente: Cliente;
  items: LineaPedido[];
  direccion: Direccion;
  factura: Factura;
  total: number;
}

export class Pedido {
  constructor(public descripcion: string,
              public formaPago: string,
              public cliente: Cliente,
              public items: LineaPedido[],
              public direccion: Direccion,
              public factura: Factura,
              public observacion?: string,
              public id?: number,
              public createAt?: string) {}
}

export interface LineaPedido {
  id?: number;
  cantidad: number;
  producto: Producto;
}

export class LineaPedido {
  constructor(public cantidad: number = 1,
              public producto: Producto,
              public id?: number) {}

  public calcularImporte(): number {
    return this.cantidad * parseFloat(this.producto.precio);
  }
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
