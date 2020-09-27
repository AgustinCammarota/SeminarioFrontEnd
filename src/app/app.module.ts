import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RoutesRoutingModule} from './routes-routing.module';
import {ComponentModule} from './components/component.module';

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RoutesRoutingModule,
        ComponentModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
