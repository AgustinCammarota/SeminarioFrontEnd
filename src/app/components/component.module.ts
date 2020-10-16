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
import {ErrorComponent} from './layout/error/error.component';


@NgModule({
  declarations: [
    NavbarComponent,
    HomeComponent,
    ClienteComponent,
    SidebarComponent,
    LayoutComponent,
    FooterComponent,
    FormularioClienteComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxMaskModule.forChild()
  ], exports: [
    NavbarComponent,
    HomeComponent,
    ClienteComponent,
    SidebarComponent,
    LayoutComponent,
    ErrorComponent
  ]
})
export class ComponentModule { }
