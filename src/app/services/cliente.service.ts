import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cliente, PageCliente} from '../models/cliente';
import {URL_API_CLIENTES} from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${URL_API_CLIENTES}`);
  }

  getClientesPage(page: string, size: string): Observable<PageCliente> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageCliente>(`${URL_API_CLIENTES}/page`, {params});
  }

  getClienteFiltro(termino: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${URL_API_CLIENTES}/filtrar/${termino}`);
  }

}
