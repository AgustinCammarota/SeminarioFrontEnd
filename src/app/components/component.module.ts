import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from './layout/navbar/navbar.component';
import {HomeComponent} from './home/home.component';
import {ClienteComponent} from './cliente/cliente.component';
import {SidebarComponent} from './layout/sidebar/sidebar.component';
import {LayoutComponent} from './layout/layout.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { FooterComponent } from './layout/footer/footer.component';
import { FormularioClienteComponent } from './cliente/formulario-cliente/formulario-cliente.component';
import {NgxMaskModule} from 'ngx-mask';
import {ProductoComponent} from './producto/producto.component';
import {FormularioProductoComponent} from './producto/formulario-producto/formulario-producto.component';
import { DetalleProductoComponent } from './producto/detalle-producto/detalle-producto.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { DetalleProveedorComponent } from './proveedor/detalle-proveedor/detalle-proveedor.component';
import { FormularioProveedorComponent } from './proveedor/formulario-proveedor/formulario-proveedor.component';
import { PedidoComponent } from './pedido/pedido.component';
import { DetallePedidoComponent } from './pedido/detalle-pedido/detalle-pedido.component';
import { FormularioPedidoComponent } from './pedido/formulario-pedido/formulario-pedido.component';
import { DetalleClienteComponent } from './cliente/detalle-cliente/detalle-cliente.component';
import { ChartsModule } from 'ng2-charts';
import { PdfMakeWrapper } from 'pdfmake-wrapper' ;
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ReportesComponent } from './reportes/reportes.component';

PdfMakeWrapper.setFonts(pdfFonts);

@NgModule({
  declarations: [
    NavbarComponent,
    HomeComponent,
    ClienteComponent,
    ProductoComponent,
    SidebarComponent,
    LayoutComponent,
    FooterComponent,
    FormularioClienteComponent,
    FormularioProductoComponent,
    DetalleProductoComponent,
    ProveedorComponent,
    DetalleProveedorComponent,
    FormularioProveedorComponent,
    PedidoComponent,
    DetallePedidoComponent,
    FormularioPedidoComponent,
    DetalleClienteComponent,
    ReportesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ChartsModule,
    NgxMaskModule.forChild()
  ], exports: [
    NavbarComponent,
    HomeComponent,
    ClienteComponent,
    SidebarComponent,
    LayoutComponent,
    ProductoComponent
  ]
})
export class ComponentModule { }
