import { S } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { routes } from 'src/app/core/helpers/routes/routes';
import {
  apiResultFormat,
  pageSelection,
  purchasereport,
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
  public expensereport: Array<any> = [];
  allCategories: any = [
    { name: 'Reservations', checked: false },
    { name: 'Accounts', checked: false },
  ];

  reservations: any = [];
  accounts: any = [];
  reservationUnfiltered: any = [];
  accountsUnfiltered: any = [];

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    if (this.router.url == this.routes.receivableReport) {
      this.getReservations();
      this.getAccounts();
    }
  }

  ngOnInit(): void {
  }

  private getReservations(): void {
    this.data.getReservations().subscribe((res: apiResultFormat) => {
      this.reservations = res.data
        .filter((item: any) => item.total_remaining > 0)
        .map((item: any) => ({ ...item, type: 'Reservation' }));

      if (this.reservations.length > 0) {
        this.allCategories[0].checked = true;
        this.reservationUnfiltered = structuredClone(this.reservations);
      }
      this.getAccounts();
    });
  }
  private getAccounts(): void {
    this.data.getVendors().subscribe((res: apiResultFormat) => {
      this.accounts = res.data
        .filter((item: any) => item.subcategory === 'Other Receivable')
        .map((item: any) => ({ ...item, type: 'Account' }));
      if (this.accounts.length > 0) {
        this.allCategories[1].checked = true;
        this.accountsUnfiltered = structuredClone(this.accounts);
      }
      
      this.expensereport = [
        ...this.reservations.map((r: any) => ({
          type: r.type,
          name: r.reservation_name,
          balance: r.total_remaining,
        })),
        ...this.accounts.map((a: any) => ({
          type: a.type,
          name: a.name,
          balance: a.balanceNumber,
        }))
      ];
    });
  }

  public searchData(value: string): void {
  }

  public sortData(sort: Sort) {
    const data = this.expensereport.slice();

    if (!sort.active || sort.direction === '') {
      this.expensereport = data;
    } else {
      this.expensereport = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  totalRecievable() {
    let total = 0;
    this.reservations.forEach((item: any) => {
      total += item.total_remaining;
    });
    this.accounts.forEach((item: any) => {
      total += item.balanceNumber;
    });
    return total;
  }

  closingExpenseDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
  }
  
  filterData() {
    this.reservations = structuredClone(this.reservationUnfiltered);
    this.accounts = structuredClone(this.accountsUnfiltered);

    if(!this.allCategories[0].checked && !this.allCategories[1].checked) {
      this.reservations = [];
      this.accounts = [];
    } else if (!this.allCategories[0].checked){
      this.reservations = [];
    } else if (!this.allCategories[1].checked){
      this.accounts = [];
    }

    this.expensereport = [
      ...this.reservations.map((r: any) => ({
        type: r.type,
        name: r.reservation_name,
        balance: r.total_remaining,
      })),
      ...this.accounts.map((a: any) => ({
        type: a.type,
        name: a.name,
        balance: a.balanceNumber,
      }))
    ];
  }
}
