import {Component, Inject, OnInit} from '@angular/core';
import {ProductoService} from '../../../services/producto.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Producto} from '../../../models/producto';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {

  loading = false;
  imagen: Observable<any>;

  constructor(private productoService: ProductoService,
              @Inject(MAT_DIALOG_DATA) public data: Producto) { }

  ngOnInit(): void {
    this.imagen = this.productoService.getProductoFoto(this.data.id);
  }

}
