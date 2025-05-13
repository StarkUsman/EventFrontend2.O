import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import {
  apiResultFormat,
  pageSelection,
} from 'src/app/core/models/models';
import { DataService } from 'src/app/core/services/data/data.service';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.scss'],
})
export class PurchaseReportComponent implements OnInit {
  public routes = routes;
  startDate: string = '';
  endDate: string = '';
  reportData: any[] = [];
  allServices: any[] = [];
  unfilteredData: any[] = [];
  
  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.serviceReport) {
        this.getTableData({ skip: res.skip, limit: res.limit });
      }
    });
  }

  ngOnInit(): void {
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getReservations().subscribe((apiRes: apiResultFormat) => {
      apiRes.data.map((res: any, index: number) => {
        if (res.additional_services.length > 0) {
          this.reportData.push({
            customerName: res.reservation_name,
            services: res.additional_services,
            date: res.dashboardDate
          });
          // push unique additional_service_name to allServices
          res.additional_services.forEach((service: any) => {
            const exists = this.allServices.some(
              (s) => s.name === service.additional_service_name
            );
          
            if (!exists) {
              this.allServices.push({
                name: service.additional_service_name,
                checked: true,
              });
            }
          });           
        }
      });

      this.unfilteredData = structuredClone(this.reportData);
    });
  }

  public sortData(sort: Sort) {
    // const data = this.expensereport.slice();

    // if (!sort.active || sort.direction === '') {
    //   this.expensereport = data;
    // } else {
    //   this.expensereport = data.sort((a, b) => {
    //     const aValue = (a as never)[sort.active];
    //     const bValue = (b as never)[sort.active];
    //     return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
    //   });
    // }
  }

  closingDate(){
    if(this.endDate){
      return this.endDate;
    } else {
      // return today's Pakistan date
      const today = new Date();
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const formatter = new Intl.DateTimeFormat('en-PK', options);
      const parts = formatter.formatToParts(today);
      const formattedDate = `${parts[2].value}-${parts[0].value}-${parts[4].value}`;
      return formattedDate;
    }
  }

  totalDebit() {
    let total = 0;
    this.reportData.forEach((item: any) => {
      item.services.forEach((service: any) => {
        total += service.totalPrice;
      });
    });
    return total;
  }

  getDateRange(startStr: string, endStr: string): [Date, Date] {
    const start = new Date(startStr);
    const end = new Date(endStr);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  }  

  filterData() {
    this.reportData = structuredClone(this.unfilteredData);
    //filter the reportData and get the those reportData.services where service.checked in allServices is true
    this.reportData = this.reportData.filter((item: any) => {
      item.services = item.services.filter((service: any) => {
      const matchingService = this.allServices.find(
        (s) => s.name === service.additional_service_name
      );
      return matchingService && matchingService.checked;
      });
      return item.services.length > 0;
    });

    if (this.startDate && this.endDate) {
      const [start, end] = this.getDateRange(this.startDate, this.endDate);
      this.reportData = this.reportData.filter((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
    }
  }
}
