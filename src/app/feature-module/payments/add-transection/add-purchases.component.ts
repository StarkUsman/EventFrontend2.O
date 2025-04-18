import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, routes } from 'src/app/core/core.index';
import {
  apiResultFormat,
  editcreditnotes,
  pageSelection,
} from 'src/app/core/models/models';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
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
  categories: any = [];
  creditControl = new FormControl();
  debitControl = new FormControl();

  filteredCreditOptions!: Observable<string[]>;
  filteredDebitOptions!: Observable<string[]>;

  constructor(private router: Router, private data: DataService) {
    this.newTransaction.date = this.purchaseDateValue;
  }

  ngOnInit(): void {
    this.data.getVendors().subscribe((res) => {
      this.allAccounts = res.data;

      for (let i = 0; i < res.data.length; i++) {
        this.categories.push(res.data[i].name);
      }

      this.filteredCreditOptions = this.creditControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );

      this.filteredDebitOptions = this.debitControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });
    
    this.data.getVouchers().subscribe((res) => {
      this.allVouchers = res.data;
    });

    this.data.getVendors().subscribe((res) => {
      this.allAccounts = res.data;
    });

    this.data.getTransaction().subscribe((res) => {
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.categories.filter((option: any) => option.toLowerCase().includes(filterValue));
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

  onDebitAccountSelected(event: any){
    this.newTransaction.debitAccount = this.allAccounts.find((account: any) => account.name === event);
    this.copyAmount(this.newTransaction.debitAccount)
    console.log("############################");
    console.log(event);
    console.log("############################")
  }

  onCreditAccountSelected(event: any){
    this.newTransaction.creditAccount = this.allAccounts.find((account: any) => account.name === event);
    console.log("############################");
    console.log(event);
    console.log("############################")
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
    this.data.addTransaction(this.newTransaction).subscribe((res: any) => {
      this.newTransaction = {};
      const transId = res.id;
      this.router.navigate([routes.transactionDetails], {
        queryParams: { id: transId }
      });
    });
  }
}
