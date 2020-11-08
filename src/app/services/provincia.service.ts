import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {URL_API_PEDIDOS} from '../config/config';
import {HttpClient} from '@angular/common/http';
import {Provincia} from '../models/provincia';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  constructor(private http: HttpClient) { }

  getProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${URL_API_PEDIDOS}/direccion/provincias`);
  }
}
