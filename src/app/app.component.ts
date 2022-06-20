import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, ColumnApi, GridOptions } from 'ag-grid-community';
import * as dayjs from 'dayjs';
import { CustomDateRangeForDeliveryComponent } from './custom-date-range-picker-delivery';
import { CustomDateRangeForShipmentComponent } from './custom-date-range-picker-shipment';
import { testdata } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'datepicker';
  context: any;
  selectedShipmentDateRange: any;
  selectedDeliveryDateRange: any;
  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;
  public rowData: any;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  filterParams = {
    inRangeInclusive: true,
    comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
      var selectedDateFrom = dayjs(this.selectedShipmentDateRange[0]).set(
        'hours',
        0
      );
      var selectedDateTo;
      var formatedCellValue = dayjs(cellValue).set('hours', 0);
      if (this.selectedShipmentDateRange.length == 2) {
        selectedDateTo = dayjs(this.selectedShipmentDateRange[1]).set(
          'hours',
          0
        );
        if (
          formatedCellValue.isAfter(selectedDateFrom) &&
          formatedCellValue.isBefore(selectedDateTo)
        ) {
          return 0;
        }
      } else if (selectedDateFrom.isSame(formatedCellValue)) {
        return 0;
      }
      return -1;
    },
  };

  gridOptions: GridOptions = {
    animateRows: true,
    defaultColDef: {
      sortable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      resizable: true,
      autoHeight: true,
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    frameworkComponents: {
      customDateRangeForDeliveryComponent: CustomDateRangeForDeliveryComponent,
      customDateRangeForShipmentComponent: CustomDateRangeForShipmentComponent,
    },
    components: {
      // agDateInput: CustomDateComponent,
    },
    columnDefs: [
      { field: 'shipmentId' },
      { field: 'referenceValues' },
      {
        field: 'shipmentDate',
        filter: 'agDateColumnFilter',
        filterParams: this.filterParams,

        floatingFilterComponent: CustomDateRangeForShipmentComponent,
        minWidth: 240,
        cellRenderer: (params: any) => {
          return dayjs(params.data.shipmentDate).format('MMMM DD, YYYY');
        },
        suppressMenu: true,
      },
      {
        field: 'firstOrigin',
        cellRenderer: (param: any) => {
          return param.data.firstOrigin;
        },
      },
      {
        field: 'lastLocationName',
        cellRenderer: (param: any) => {
          return param.data.lastLocationName;
        },
      },
      {
        field: 'lastDestination',
        cellRenderer: (param: any) => {
          return param.data.lastDestination;
        },
      },
      {
        field: 'deliveryDate',
        filter: 'agDateColumnFilter',
        filterParams: this.filterParams,

        floatingFilterComponent: CustomDateRangeForDeliveryComponent,
        minWidth: 240,
        cellRenderer: (params: any) => {
          return dayjs(params.data.deliveryDate).format('MMMM DD, YYYY');
        },
        suppressMenu: true,
      },
      { field: 'shipmentStatusName' },
      { field: 'webUnitCode' },
    ],
    onGridReady: (params: any) => {
      this.rowData = testdata;
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
  };

  constructor() {
    this.context = {
      componentParent: this,
    };
  }

  setTimeRangeFilter(range: any, filterInstanceName: any) {
    var instance = this.gridApi.getFilterInstance(filterInstanceName);
    var dateFromInput =
      range.length == 0 ? '' : dayjs(range[0]).format('YYYY-MM-DD');
    var datetOInput =
      range.length == 0 ? '' : dayjs(range[1]).format('YYYY-MM-DD');

    instance?.setModel({
      type: 'inRange',
      dateFrom: dateFromInput,
      dateTo: datetOInput,
    });
    this.gridApi.onFilterChanged();
  }
}
