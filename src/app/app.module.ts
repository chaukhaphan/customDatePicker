import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';

import { AppComponent } from './app.component';
import { CustomDateRangeForDeliveryComponent } from './custom-date-range-picker-delivery';
import { CustomDateRangeForShipmentComponent } from './custom-date-range-picker-shipment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  declarations: [
    AppComponent,
    CustomDateRangeForShipmentComponent,
    CustomDateRangeForDeliveryComponent,
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([
      CustomDateRangeForShipmentComponent,
      CustomDateRangeForDeliveryComponent,
    ]),
    NgxDaterangepickerMd.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
