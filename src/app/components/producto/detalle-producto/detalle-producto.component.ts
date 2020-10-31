import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Producto} from '../../../models/producto';
import {URL_API_PRODUCTOS} from '../../../config/config';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {

  BASE_END_POINT = URL_API_PRODUCTOS + '/uploads/img/' + this.data.id + '?archivoHashCode=' + this.data.archivoHashCode;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Producto) { }

  ngOnInit(): void {
  }

}
