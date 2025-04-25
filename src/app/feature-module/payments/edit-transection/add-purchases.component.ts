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
import { ActivatedRoute } from '@angular/router';
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
  categories: any = [];
  creditControl = new FormControl();
  debitControl = new FormControl();

  filteredCreditOptions!: Observable<string[]>;
  filteredDebitOptions!: Observable<string[]>;
  creditLedgerID: any = 0;
  debitLedgerID: any = 0;

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) {
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

    this.route.queryParams.subscribe(params => {
      let id = params['id'];
      this.data.getTransactionById(id).subscribe((res: any) => {
        this.newTransaction = res;
        this.newTransaction.date = new Date(this.newTransaction.date);
        this.creditLedgerID = this.newTransaction.creditAccount.ledgerId;
        this.debitLedgerID = this.newTransaction.debitAccount.ledgerId;
        this.newTransaction.debitAccountName = this.newTransaction.debitAccount.name;
        this.newTransaction.creditAccountName = this.newTransaction.creditAccount.name;
        this.newTransaction.creditAccount = this.allAccounts.find((account: any) => account.name === this.newTransaction.creditAccountName);
        this.newTransaction.debitAccount = this.allAccounts.find((account: any) => account.name === this.newTransaction.debitAccountName);

        if (this.newTransaction?.img) {
          const file = this.base64ToFile(
            this.newTransaction.img,
            'signature.png'
          );
          this.files.push(file);
        }

      });
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

  base64ToFile(data: any, filename: string) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
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
  }

  onCreditAccountSelected(event: any){
    this.newTransaction.creditAccount = this.allAccounts.find((account: any) => account.name === event);
  }

  // ledger function
  updateCreditLedger() {
    let ledgerToUpdate = {
      id: this.creditLedgerID,
      name: this.newTransaction.voucher,
      purch_id: this.newTransaction.trans_id,
      vendor_id: this.newTransaction.creditAccount.id,
      amountDebit: 0,
      amountCredit: this.newTransaction.amount,
    };
    this.data.updateLedgerById(ledgerToUpdate).subscribe((res: any) => {
      this.newTransaction.creditAccount.ledgerId = this.creditLedgerID;
      this.updateDebitLedger();
    });
  }

  updateDebitLedger() {
    let ledgerToUpdate = {
      id: this.debitLedgerID,
      name: this.newTransaction.voucher,
      purch_id: this.newTransaction.trans_id,
      vendor_id: this.newTransaction.debitAccount.id,
      amountDebit: this.newTransaction.amount,
      amountCredit: 0,
    };

    this.data.updateLedgerById(ledgerToUpdate).subscribe((res: any) => {
      this.newTransaction.debitAccount.ledgerId = this.debitLedgerID;
      this.data.updateTransaction(this.newTransaction).subscribe((res: any) => {
        this.router.navigate([routes.transactionDetails], {
          queryParams: { id: this.newTransaction.id }
        });
        this.newTransaction = {};
      });
    });
  }


  addTransaction() {
    this.updateCreditLedger();
  }
}
