import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RoutesRoutingModule} from './routes-routing.module';
import {ComponentModule} from './components/component.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ProductoComponent } from './components/producto/producto.component';
import { FormularioProductoComponent } from './components/producto/formulario-producto/formulario-producto.component';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


@NgModule({
  declarations: [
    AppComponent,
    ProductoComponent,
    FormularioProductoComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RoutesRoutingModule,
        ComponentModule,
        NgxMaskModule.forRoot(options)
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
