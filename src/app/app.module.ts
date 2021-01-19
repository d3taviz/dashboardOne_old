import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Chart1Component } from './charts/chart1/chart1.component';
import { Chart2Component } from './charts/chart2/chart2.component';
import { Chart3Component } from './charts/chart3/chart3.component';
import { Chart4Component } from './charts/chart4/chart4.component';

@NgModule({
  declarations: [
    AppComponent,
    Chart1Component,
    Chart2Component,
    Chart3Component,
    Chart4Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
