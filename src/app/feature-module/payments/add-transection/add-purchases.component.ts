import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, routes } from 'src/app/core/core.index';
import {
  apiResultFormat,
  editcreditnotes,
  pageSelection,
} from 'src/app/core/models/models';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-purchases',
  templateUrl: './add-purchases.component.html',
  styleUrls: ['./add-purchases.component.scss'],
})
export class AddPurchasesComponent implements OnInit {
  myDateValue!: Date;
  purchaseDateValue: Date = new Date();
  dueDateValue: Date = new Date();
  public minDate!: Date;
  public maxDate!: Date;
  public routes = routes;
  country = 'India';
  products = 'products';
  selectbank = 'Bank1';
  discount = 'discount1';
  tax = 'Tax';
  public editcreditnotes: Array<editcreditnotes> = [];
  public Toggledata = false;
  dataSource!: MatTableDataSource<editcreditnotes>;
  public searchDataValue = '';
  // pagination variables
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  //** / pagination variables
  allVouchers: any = [];
  allAccounts: any = [];
  newTransaction: any = {};
  trans_id: any = null;

  constructor(private data: DataService) {
    this.newTransaction.date = this.purchaseDateValue;
  }

  ngOnInit(): void {
    this.data.getVendors().subscribe((res) => {
      this.allAccounts = res.data;
    });
    
    this.data.getVouchers().subscribe((res) => {
      this.allVouchers = res.data;
    });

    this.data.getVendors().subscribe((res) => {
      this.allAccounts = res.data;
    });

    this.data.getTransaction().subscribe((res) => {
      // set newTransaction.purch_id to last purch_id + 1 and make it 6 digit
      this.trans_id = res.data[0]? (res.data[0].id + 1) : 1;
      let purch_id = res.data[0] ? res.data[0].trans_id : 100;
      purch_id = parseInt(purch_id) + 1;
      purch_id = purch_id.toString();
      while (purch_id.length < 6) {
        purch_id = "0" + purch_id;
      }
      this.newTransaction.trans_id = purch_id;
    });
  }

  files: File[] = [];
  onSelect(event: { addedFiles: File[] }) {
    const file = event.addedFiles[0];
    this.files.push(...event.addedFiles);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.newTransaction.img = reader.result;
    };
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  debitBalance: any = 0;

  copyAmount(account: any) {
    this.debitBalance = JSON.parse(JSON.stringify(account.balanceNumber));
  }

  remainingAmount: any = 0;
  calculateRemainingAmount(){
    this.remainingAmount = this.debitBalance - this.newTransaction.amount;
  }


  // ledger function
  addLedger(purch_id: any, vendor_id: any, amountDebit: any) {
    let ledger = {
      name: "SRV",
      purch_id: purch_id,
      vendor_id: vendor_id,
      amountDebit: amountDebit,
      amountCredit: 0
    };

    this.data.addLedger(ledger).subscribe((res) => { });
  }


  addTransaction() {
    this.data.addTransaction(this.newTransaction).subscribe((res) => {
      this.newTransaction = {};
    });
  }
}
