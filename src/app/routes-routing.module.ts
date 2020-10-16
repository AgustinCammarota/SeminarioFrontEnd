import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClienteComponent} from './components/cliente/cliente.component';
import {HomeComponent} from './components/home/home.component';
import {ErrorComponent} from './components/layout/error/error.component';
import {ProductoComponent} from './components/producto/producto.component';

const routes: Routes = [
  {path: 'clientes', component: ClienteComponent},
  {path: 'productos', component: ProductoComponent},
  {path: 'home', component: HomeComponent},
  {path: 'error', component: ErrorComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class RoutesRoutingModule { }
