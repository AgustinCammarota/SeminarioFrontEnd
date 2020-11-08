import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PagePedido, Pedido} from '../models/pedido';
import {URL_API_PEDIDOS} from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  getPedidosPage(page: string, size: string): Observable<PagePedido> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagePedido>(`${URL_API_PEDIDOS}/page`, {params});
  }

  getPedidoFiltro(termino: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${URL_API_PEDIDOS}/filtrar/${termino}`);
  }

  savePedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${URL_API_PEDIDOS}`, pedido, {headers: this.cabeceras});
  }

}
