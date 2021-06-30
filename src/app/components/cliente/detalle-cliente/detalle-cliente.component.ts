import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Cliente} from '../../../models/cliente';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.css']
})
export class DetalleClienteComponent implements OnInit {

  cliente: Cliente | any = {};

  constructor(private dialogRef: MatDialogRef<DetalleClienteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Cliente) { }

  ngOnInit(): void {
  }

}
