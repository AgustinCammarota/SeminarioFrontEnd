import { Injectable } from '@angular/core';
import {PdfMakeWrapper, Table, Txt} from 'pdfmake-wrapper';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generarFacturaPdf(pedido): void {
    const pdf = new PdfMakeWrapper();
    pdf.info({
      title: `Factura N°${pedido.factura.numeracion}`,
      author: 'Phanter Gaming',
      subject: 'Factura',
    });
    pdf.pageSize('A4');

    pdf.add(new Txt(`Factura del Pedio N°${pedido.factura.numeracion} con Fecha ${pedido.factura.createAt}`).bold().italics().end);

    pdf.add(new Txt('Datos de la empresa').margin([0, 20, 0, 10]).italics().end);
    pdf.add(new Table([
      [ 'Empresa', `${pedido.factura.nombreEmpresa}`],
      [ 'Domicilio Fiscal', `${pedido.factura.domicilioFiscal}`],
      [ 'Correo', `${pedido.factura.email}`],
      [ 'Pais', `${pedido.factura.pais}`],
      [ 'Telefono Atencion', `${pedido.factura.telefonoAtencion}`],
      [ 'Telefono Consulta', `${pedido.factura.telefonoPersonal}`]
    ]).widths([ 200, 300 ]).alignment('justify').end);

    pdf.add(new Txt('Datos del cliente').margin([0, 20, 0, 10]).italics().end);
    pdf.add(new Table([
      [ 'Nombre', `${pedido.cliente.nombre}`],
      [ 'DNI', `${pedido.cliente.dni}`],
      [ 'Correo', `${pedido.cliente.email}`],
      [ 'Telefono', `${pedido.cliente.telefono}`],
    ]).widths([ 200, 300 ]).alignment('justify').end);

    pdf.add(new Txt('Datos del pedido').margin([0, 20, 0, 10]).italics().end);
    pedido.items.forEach(item => {
      pdf.add(new Table([
        [ 'Forma de Pago', `${pedido.formaPago}`],
        [ 'Total', `$${pedido.total}`],
        [ 'Envio', `${!pedido.direccion ? 'A domicilio' : 'Retira local'}`],
        [ 'Producto', `${item.producto.nombre}`],
        [ 'Categoria', `${item.producto.categoria.categoria}`],
        [ 'Cantidad', `${item.producto.cantidad}`],
        [ 'Precio', `$${item.producto.precio}`],
      ]).widths([ 200, 300 ]).alignment('justify').end);
    });

    pdf.add(new Txt('¡¡¡Muchas gracias por realizar el pedido!!!').margin([0, 40, 0, 0]).bold().alignment('right').italics().end);


    pdf.create().open();
  }

  generarReportePdf(mes: string): void {
    const pdf = new PdfMakeWrapper();
    pdf.info({
      title: `Reporte del mes de ${mes}`,
      author: 'Phanter Gaming',
      subject: 'Reporte',
    });
    pdf.pageSize('A4');
    pdf.add(new Txt(`Reporte del Mes ${mes}`).bold().italics().end);
    pdf.add(new Txt(`El apartado de reportes se encuentra aun en desarrollo, disculpe los inconvenientes. ¡¡¡Gracias!!!`).margin([0, 60, 0, 0]).bold().italics().end);
    pdf.create().download();
  }
}
