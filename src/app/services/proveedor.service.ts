import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {URL_API_PROVEEDORES} from '../config/config';
import {PageProveedor, Proveedor} from '../models/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  getProveedoresPage(page: string, size: string): Observable<PageProveedor> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageProveedor>(`${URL_API_PROVEEDORES}/page`, {params});
  }

  getProveedoreFiltro(termino: string): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${URL_API_PROVEEDORES}/filtrar/${termino}`);
  }

  saveProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(`${URL_API_PROVEEDORES}`, proveedor, {headers: this.cabeceras});
  }

  updateProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${URL_API_PROVEEDORES}/${proveedor.id}`, proveedor, {headers: this.cabeceras});
  }

  deleteProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.delete<Proveedor>(`${URL_API_PROVEEDORES}/${proveedor.id}`, {headers: this.cabeceras});
  }

  deleteProveedores(proveedores: Proveedor[]): Observable<Proveedor[]> {
    return this.http.delete<Proveedor[]>(`${URL_API_PROVEEDORES}`, {headers: this.cabeceras});
  }
}
