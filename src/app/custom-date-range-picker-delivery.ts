import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { IDateAngularComp } from 'ag-grid-angular';
import { IDateParams } from 'ag-grid-community';
import * as dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import * as $ from 'jquery';

// we'll be using the globally provided flatpickr for our example
declare var myFlatpickrPlugins: any;

@Component({
  selector: 'app-custom-date-range-picker',
  template: `
    <div
      #flatpickrEl
      class="ag-input-wrapper custom-date-filter"
      role="presentation"
    >
      <input
        placeholder="Select delivery date"
        type="text"
        id="deliveryDate"
        #eInput
        data-input
        style="width: 100%;height: 24px;"
      />
      <a class="input-button" title="clear" data-clear>
        <span class="material-symbols-outlined">calendar_month</span>
      </a>
    </div>
  `,
  styles: [
    `
      .custom-date-filter a {
        position: absolute;
        right: 20px;
        color: rgba(0, 0, 0, 0.54);
        cursor: pointer;
      }

      .custom-date-filter:after {
        position: absolute;
        display: block;
        font-weight: 400;
        font-family: 'Font Awesome 5 Free';
        right: 5px;
        pointer-events: none;
        color: rgba(0, 0, 0, 0.54);
      }
    `,
  ],
})
export class CustomDateRangeForDeliveryComponent
  implements IDateAngularComp, AfterViewInit, OnDestroy
{
  @ViewChild('flatpickrEl', { read: ElementRef }) flatpickrEl!: ElementRef;
  @ViewChild('eInput', { read: ElementRef }) eInput!: ElementRef;
  private date!: Date;
  private params!: any;
  private picker: any;

  agInit(params: IDateParams): void {
    this.params = params;
  }

  ngAfterViewInit(): void {
    var config: any = {
      onChange: this.onDateChanged.bind(this),
      wrap: true,
      mode: 'range',
      altFormat: 'F j, Y',
      dateFormat: 'M d, Y',
      plugins: myFlatpickrPlugins,
      ranges: {
        Clear: [],
        Today: [new Date(), new Date()],
        'Last 30 Days': [dayjs().subtract(29, 'days').toDate(), new Date()],
        'This Month': [
          dayjs().startOf('month').toDate(),
          dayjs().endOf('month').toDate(),
        ],
        'Last Month': [
          dayjs().subtract(1, 'month').startOf('month').toDate(),
          dayjs().subtract(1, 'month').endOf('month').toDate(),
        ],
      },
      rangesOnly: true, // only show the ranges menu unless the custom range button is selected
      rangesAllowCustom: true, // adds a Custom Range button to show the calendar
      rangesCustomLabel: 'Custom Range', // customize the label for the custom range button
    };

    this.picker = flatpickr(this.flatpickrEl.nativeElement, config);
    this.picker.calendarContainer.classList.add('ag-custom-component-popup');
  }

  ngOnDestroy() {
    console.log(`Destroying DateComponent`);
  }

  onDateChanged(selectedDates: any) {
    var isCustomRange =
      $(
        '.flatpickr-calendar.arrowTop.arrowLeft .nav-item.d-grid:has(button.active)'
      ).index() == 5;

    if (
      selectedDates.length == 0 ||
      selectedDates.length == 2 ||
      !isCustomRange
    ) {
      this.date = selectedDates[0] || null;
      // this.params.onDateChanged();
      this.componentParent.selectedDeliveryDateRange = selectedDates;
      this.componentParent.setTimeRangeFilter(selectedDates, 'deliveryDate');
    }
  }

  get componentParent() {
    return this.params.context.componentParent;
  }

  getDate(): Date {
    return this.date;
  }

  setDate(date: Date): void {
    this.date = date || null;
    this.picker.setDate(date);
  }

  setInputPlaceholder(placeholder: string): void {
    this.eInput.nativeElement.setAttribute('placeholder', placeholder);
  }

  setInputAriaLabel(label: string): void {
    this.eInput.nativeElement.setAttribute('aria-label', label);
  }
}
