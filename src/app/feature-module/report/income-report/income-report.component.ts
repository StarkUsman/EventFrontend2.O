import { forkJoin } from 'rxjs';
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
  selector: 'app-income-report',
  templateUrl: './income-report.component.html',
  styleUrls: ['./income-report.component.scss'],
})
export class IncomeReportComponent implements OnInit {
  public routes = routes;
  startDate: string = '';
  endDate: string = '';
  reportData: any[] = [];
  allCustomers: any[] = [];
  allAccounts: any[] = [];
  allServices: any[] = [];
  unfilteredData: any[] = [];
  
  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.incomeReport) {
        this.getTableData({ skip: res.skip, limit: res.limit });
      }
    });
  }

  ngOnInit(): void {
  }

  reservations: any[] = [];
  payments: any[] = [];

  options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  private getTableData(pageOption: pageSelection): void {
    this.data.getReservations().subscribe((apiRes: apiResultFormat) => {
      const ledgerRequests: any = [];
  
      apiRes.data.forEach((res: any) => {
        if (res.payment_received > 0) {
          this.reservations.push(res);
  
          const customerExists = this.allCustomers.some(
            (s) => s.name === res.reservation_name
          );
          if (!customerExists) {
            this.allCustomers.push({
              name: res.reservation_name,
              checked: true,
            });
          }
  
          // queue the ledger request
          ledgerRequests.push(this.data.getReservationLedgerById(res.booking_id));
        }
      });
  
      forkJoin(ledgerRequests).subscribe((ledgerResponses: any) => {
        ledgerResponses.forEach((ledgerData: any) => {
          ledgerData.data.forEach((res: any) => {
            res.date = new Date(res.date).toLocaleString('en-PK', this.options);
            this.payments.push(res);
  
            const accountExists = this.allAccounts.some(
              (s) => s.name === res.account
            );
            if (!accountExists) {
              this.allAccounts.push({
                name: res.account,
                checked: true,
              });
            }
          });
        });

        //loop over this.reservations, check if the reservation.booking_id is in this.payments, if yes then make objects containing 1. reservation.reservation_name(same for all payments) and 2. payment.ledgerId, payment.amount, payment.account, payment.date, payment.user
        this.reservations.forEach((reservation: any) => {
          const reservationPayments = this.payments.filter(
            (payment: any) => payment.booking_id === reservation.booking_id
          );
  
          if (reservationPayments.length > 0) {
            reservationPayments.forEach((payment: any) => {
                this.reportData.push({
                customerName: reservation.reservation_name,
                voucher: payment.ledgerId.toString().padStart(6, '0'),
                amount: payment.amount,
                account: payment.account,
                date: payment.date.replace(' at', ''),
                user: payment.user,
                });
            });
          }
        });

        console.log(this.allCustomers);
  
        this.unfilteredData = structuredClone(this.reportData);
      });
    });
  }  

  public sortData(sort: Sort) {
    const data = this.reportData.slice();

    if (!sort.active || sort.direction === '') {
      this.reportData = data;
    } else {
      this.reportData = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
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

  totalAmount() {
    let total = 0;
    this.reportData.forEach((item: any) => {
      total += item.amount;
    });
    return total.toFixed(2);    
  }

  getDateRange(startStr: string, endStr: string): [Date, Date] {
    const start = new Date(startStr);
    const end = new Date(endStr);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  }  

  filterData() {
    this.reportData = structuredClone(this.unfilteredData);
    // Filter the reportData based on the selected customers and accounts
    this.reportData = this.reportData.filter((item: any) => {
      const customerChecked = this.allCustomers.some(
        (customer) => customer.name === item.customerName && customer.checked
      );
      const accountChecked = this.allAccounts.some(
        (account) => account.name === item.account && account.checked
      );
      return customerChecked && accountChecked;
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
