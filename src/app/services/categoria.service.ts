import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categoria} from '../models/categoria';
import {URL_API_PRODUCTOS} from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${URL_API_PRODUCTOS}/categorias`);
  }
}
