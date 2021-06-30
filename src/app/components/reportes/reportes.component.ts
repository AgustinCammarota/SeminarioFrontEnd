import { Component, OnInit } from '@angular/core';
import {PdfService} from '../../services/pdf.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  anoActual: number;
  card = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  constructor(public pdfService: PdfService) {
    this.anoActual = new Date().getFullYear();
  }

  ngOnInit(): void {
  }


}
