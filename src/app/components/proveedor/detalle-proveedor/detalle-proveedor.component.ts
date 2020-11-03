import {Component, Inject, OnInit} from '@angular/core';
import {Proveedor} from '../../../models/proveedor';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-proveedor',
  templateUrl: './detalle-proveedor.component.html',
  styleUrls: ['./detalle-proveedor.component.css']
})
export class DetalleProveedorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Proveedor) { }

  ngOnInit(): void {
  }

}
