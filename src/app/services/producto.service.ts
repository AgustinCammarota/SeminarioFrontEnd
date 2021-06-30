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

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${URL_API_PRODUCTOS}`);
  }

  getProductoFiltro(termino: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${URL_API_PRODUCTOS}/filtrar/${termino}`);
  }

  getProducto(idProducto: number): Observable<Producto> {
    return this.http.get<Producto>(`${URL_API_PRODUCTOS}/${idProducto}`);
  }

  saveProductoFoto(idProducto: string, archivo: File, nombreFoto: string): Observable<Producto> {
    return this.http.post<Producto>(`${URL_API_PRODUCTOS}/upload`, this.createFormDate(idProducto, archivo, nombreFoto));
  }

  saveProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${URL_API_PRODUCTOS}`, producto, {headers: this.cabeceras});
  }

  updateProducto(producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${URL_API_PRODUCTOS}/${producto.id}`, producto, {headers: this.cabeceras});
  }

  deleteProducto(producto: Producto): Observable<Producto> {
    return this.http.delete<Producto>(`${URL_API_PRODUCTOS}/${producto.id}`, {headers: this.cabeceras});
  }

  private createFormDate(idProducto: string, archivo: File, nombreFoto: string): FormData {
    const formDataProducto = new FormData();
    formDataProducto.append('archivo', archivo);
    formDataProducto.append('idProducto', idProducto);
    formDataProducto.append('nombreFoto', nombreFoto);

    return formDataProducto;
  }
}
