import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PageProducto, Producto} from '../models/producto';
import {URL_API_PRODUCTOS} from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  getProductosPage(page: string, size: string): Observable<PageProducto> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageProducto>(`${URL_API_PRODUCTOS}/page`, {params});
  }

  getProductoFiltro(termino: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${URL_API_PRODUCTOS}/filtrar/${termino}`);
  }

  getProductoPorCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${URL_API_PRODUCTOS}/categorias/${categoria}`);
  }

  getProducto(idProducto: number): Observable<Producto> {
    return this.http.get<Producto>(`${URL_API_PRODUCTOS}/${idProducto}`);
  }

  saveProducto(producto: Producto, archivo: File): Observable<Producto> {
    return this.http.post<Producto>(`${URL_API_PRODUCTOS}`, this.createFormDate(producto, archivo));
  }

  updateProducto(producto: Producto, archivo: File): Observable<Producto> {
    return this.http.put<Producto>(`${URL_API_PRODUCTOS}/${producto.id}`, this.createFormDate(producto, archivo));
  }

  deleteProducto(producto: Producto): Observable<Producto> {
    return this.http.delete<Producto>(`${URL_API_PRODUCTOS}/${producto.id}`, {headers: this.cabeceras});
  }

  private createFormDate(producto: Producto, archivo: File): FormData {
    const formatData = new FormData();
    formatData.append('archivo', archivo);
    formatData.append('nombre', producto.nombre);
    formatData.append('precio', producto.precio);
    formatData.append('cantidad', producto.cantidad);
    formatData.append('descripcion', producto.descripcion);
    formatData.append('estado', producto.estado);
    return formatData;
  }
}
