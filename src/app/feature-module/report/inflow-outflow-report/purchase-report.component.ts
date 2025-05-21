import { forkJoin } from 'rxjs';
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
  cashMaxLengthArray: any[] = [];
  cashInflow: any[] = [];
  cashOutflow: any[] = [];
  cashAccount: any = {};

  cashIn: any[] = [];
  cashOut: any[] = [];

  bankInflow: any[] = [];
  bankOutflow: any[] = [];
  bankAccount: any = {};

  bankIn: any[] = [];
  bankOut: any[] = [];

  filterDate: any = new Date().toISOString().split('T')[0];

  public routes = routes;

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.inOutReport) {
        this.getTableData({ skip: res.skip, limit: res.limit });
      }
    });
  }

  ngOnInit(): void {
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getVendorByName('CASH IN HAND').subscribe((res: any) => {
      if (res) {
        this.cashAccount = res;
      }
    });
    this.data.getVendorByName('Bank Al-Falah').subscribe((res: any) => {
      if (res) {
        this.bankAccount = res;
      }
    });
    forkJoin({
      cashVendor: this.data.getVendorByName('CASH IN HAND'),
      bankVendor: this.data.getVendorByName('Bank Al-Falah')
    }).subscribe(({ cashVendor, bankVendor }) => {

      forkJoin({
        cashTx: this.data.getTransactionByName((cashVendor as any).name),
        bankTx: this.data.getTransactionByName((bankVendor as any).name)
      }).subscribe(({ cashTx, bankTx }) => {

        // Process cash transactions
        (cashTx as any).data.forEach((element: any) => {
          if (element.creditAccount?.name === 'CASH IN HAND') {
            this.cashInflow.push(element);
          } else if (element.debitAccount?.name === 'CASH IN HAND') {
            this.cashOutflow.push(element);
          }
        });

        // Process bank transactions
        (bankTx as any).data.forEach((element: any) => {
          if (element.creditAccount?.name === 'Bank Al-Falah') {
            this.bankInflow.push(element);
          } else if (element.debitAccount?.name === 'Bank Al-Falah') {
            this.bankOutflow.push(element);
          }
        });

        // Clone arrays
        this.cashIn = structuredClone(this.cashInflow);
        this.cashOut = structuredClone(this.cashOutflow);
        this.bankIn = structuredClone(this.bankInflow);
        this.bankOut = structuredClone(this.bankOutflow);

        this.cashMaxLengthArray = Array(
          Math.max(
            this.cashInflow.length,
            this.cashOutflow.length,
            this.bankInflow.length,
            this.bankOutflow.length
          )
        ).fill(null);

        this.filterData();
      });
    });
  }

  totalCashInflow(){
    let total = 0;
    this.cashInflow.forEach((transaction: any) => {
      total += transaction.amount;
    });
    return total;
  }
  
  totalCashOutflow(){
    let total = 0;
    this.cashOutflow.forEach((transaction: any) => {
      total += transaction.amount;
    });
    return total;
  }
  
  cashClosingBalance(){
    return this.cashAccount.balance;
  }
  lastCashClosingBalance(){
    return this.cashAccount?.balance - this.totalCashInflow() + this.totalCashOutflow();
  }
  
  totalBankInflow(){
    let total = 0;
    this.bankInflow.forEach((transaction: any) => {
      total += transaction.amount;
    });
    return total;
  }

  totalBankOutflow(){
    let total = 0;
    this.bankOutflow.forEach((transaction: any) => {
      total += transaction.amount;
    });
    return total;
  }

  bankClosingBalance(){
    return this.bankAccount.balance;
  }

  lastBankClosingBalance(){
    return this.bankAccount?.balance - this.totalBankInflow() + this.totalBankOutflow();
  }


  filterData() {
    this.cashInflow = structuredClone(this.cashIn);
    this.cashOutflow = structuredClone(this.cashOut);

    this.bankInflow = structuredClone(this.bankIn);
    this.bankOutflow = structuredClone(this.bankOut);

    this.cashInflow = this.cashInflow.filter((transaction: any) => transaction.date >= this.filterDate);
    this.cashOutflow = this.cashOutflow.filter((transaction: any) => transaction.date >= this.filterDate);
    
    this.bankInflow = this.bankInflow.filter((transaction: any) => transaction.date >= this.filterDate);
    this.bankOutflow = this.bankOutflow.filter((transaction: any) => transaction.date >= this.filterDate);

    this.cashMaxLengthArray = Array(
      Math.max(
        this.cashInflow.length,
        this.cashOutflow.length,
        this.bankInflow.length,
        this.bankOutflow.length
      )
    ).fill(null);


  }
}
