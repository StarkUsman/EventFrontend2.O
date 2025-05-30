import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
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
  @ViewChild('reportTable') reportTable!: ElementRef<HTMLTableElement>;
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

  // filterDate: any = new Date().toISOString().split('T')[0];
  filterDate: any = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  endDate: any = new Date().toISOString().split('T')[0];

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

  cashSkippedBalance: any = 0;
  bankSkippedBalance: any = 0;

  skippedTransactions(){
    this.cashSkippedBalance = 0;
    this.bankSkippedBalance = 0;

    this.cashIn.forEach((transaction: any) => {
      if (transaction.date >= this.endDate) {
        this.cashSkippedBalance += transaction.amount;
      }
    });
    this.cashOut.forEach((transaction: any) => {
      if (transaction.date >= this.endDate) {
        this.cashSkippedBalance -= transaction.amount;
      }
    });
    this.bankIn.forEach((transaction: any) => {
      if (transaction.date >= this.endDate) {
        this.bankSkippedBalance += transaction.amount;
      }
    });
    this.bankOut.forEach((transaction: any) => {
      if (transaction.date >= this.endDate) {
        this.bankSkippedBalance -= transaction.amount;
      }
    });
  }
  
  cashClosingBalance(){
    return this.cashAccount.balance - this.cashSkippedBalance;
  }
  lastCashClosingBalance(){
    return this.cashClosingBalance() - this.totalCashInflow() + this.totalCashOutflow();
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
    return this.bankAccount.balance - this.bankSkippedBalance;
  }

  lastBankClosingBalance(){
    return this.bankClosingBalance() - this.totalBankInflow() + this.totalBankOutflow();
  }


  filterData() {
    this.cashInflow = structuredClone(this.cashIn);
    this.cashOutflow = structuredClone(this.cashOut);

    this.bankInflow = structuredClone(this.bankIn);
    this.bankOutflow = structuredClone(this.bankOut);

    this.cashInflow = this.cashInflow.filter((transaction: any) => transaction.date >= this.filterDate && transaction.date < this.endDate);
    this.cashOutflow = this.cashOutflow.filter((transaction: any) => transaction.date >= this.filterDate && transaction.date < this.endDate);
    
    this.bankInflow = this.bankInflow.filter((transaction: any) => transaction.date >= this.filterDate && transaction.date < this.endDate);
    this.bankOutflow = this.bankOutflow.filter((transaction: any) => transaction.date >= this.filterDate && transaction.date < this.endDate);

    this.cashMaxLengthArray = Array(
      Math.max(
        this.cashInflow.length,
        this.cashOutflow.length,
        this.bankInflow.length,
        this.bankOutflow.length
      )
    ).fill(null);

    this.skippedTransactions();
  }

    downloadCSV(): void {
    const table = this.reportTable.nativeElement;
    const rows = Array.from(table.querySelectorAll('tr'));

    const csv = rows.map(row => {
      const cols = Array.from(row.querySelectorAll('th, td')).map(cell => {
        let text = cell.textContent?.trim() ?? '';
        text = text.replace(/"/g, '""'); // Escape quotes
        return `"${text}"`;
      });
      return cols.join(',');
    }).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.setAttribute('href', url);
    anchor.setAttribute('download', 'inflowOutflow_export.csv');
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
