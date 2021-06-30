import {Component, Inject, OnInit} from '@angular/core';
import {Pedido} from '../../../models/pedido';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PdfService} from '../../../services/pdf.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css']
})
export class DetallePedidoComponent implements OnInit {

  constructor( private dialogRef: MatDialogRef<DetallePedidoComponent>,
               @Inject(MAT_DIALOG_DATA) public pedido: Pedido,
               private pdfService: PdfService) { }

  ngOnInit(): void {
  }

  openFacturaPdf(pedido): void {
    this.pdfService.generarFacturaPdf(pedido);
  }

}
