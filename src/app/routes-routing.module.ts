import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClienteComponent} from './components/cliente/cliente.component';
import {HomeComponent} from './components/home/home.component';
import {ProductoComponent} from './components/producto/producto.component';
import {ErrorComponent} from './components/layout/error/error.component';
import {ProveedorComponent} from './components/proveedor/proveedor.component';
import {PedidoComponent} from './components/pedido/pedido.component';
import {ReportesComponent} from './components/reportes/reportes.component';

const routes: Routes = [
  {path: 'clientes', component: ClienteComponent},
  {path: 'productos', component: ProductoComponent},
  {path: 'proveedores', component: ProveedorComponent},
  {path: 'pedidos', component: PedidoComponent},
  {path: 'home', component: HomeComponent},
  {path: 'error', component: ErrorComponent},
  {path: 'reportes', component: ReportesComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class RoutesRoutingModule { }
