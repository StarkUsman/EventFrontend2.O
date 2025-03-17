import { Component, OnInit } from '@angular/core';
import { routes, DataService } from 'src/app/core/core.index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
  public routes = routes;
  public Toggledata = false;
  ledgerToView: any = [];
  vendorToView: any = {};
  vendorId: any;
  filterByDate: boolean = false;
  filterByName: boolean = false;
  startDate: string = '';
  endDate: string = '';
  vendorName: string = '';
  isBalanceNegative: boolean = false;
  closingBalanceAmount: number = 0;
  closingBalanceDate: string = new Date().toLocaleDateString();
  filterByType: boolean = false;
  selectedTransactionType: string = 'credit';

  constructor(private route: ActivatedRoute, private data: DataService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'];
      this.vendorId = id;
      this.data.getLedgerByVID(id).subscribe((res: any) => {
        this.ledgerToView = res.data;
        this.ledgerToView.forEach((ledger: any) => {
          ledger.purch_id = ('000000' + ledger.purch_id).slice(-6);
        });
        this.closingBalance();
      });
      this.data.getVendorById(id).subscribe((res: any) => {
        this.vendorToView = res;
      });
    });
  }

  resetFilters(){
    this.filterByDate = false;
    this.filterByName = false;
    this.startDate = '';
    this.endDate = '';
    this.vendorName = '';
    this.isCredit = true;
    this.isDebit = true;
    this.updateLedger();
  }

  // applyFilters() {
  //   if(this.endDate && this.endDate !== ''){
  //     this.closingBalanceDate = this.endDate;
  //   }

  //   this.data.getFilteredLedger(this.vendorId, this.startDate, this.endDate, this.vendorName).subscribe((res: any) => {
  //     this.ledgerToView = res.data;
  //     this.ledgerToView.forEach((ledger: any) => {
  //       ledger.purch_id = ('000000' + ledger.purch_id).slice(-6);
  //     });
  //   });
  // }

  applyFilters() {
    if (this.endDate && this.endDate !== '') {
      this.closingBalanceDate = this.endDate;
    }
  
    // Fetch filtered ledger data based on selected filters
    this.data.getFilteredLedger(this.vendorId, this.startDate, this.endDate, this.vendorName).subscribe((res: any) => {
      this.ledgerToView = res.data;
      this.ledgerToView.forEach((ledger: any) => {
        ledger.purch_id = ('000000' + ledger.purch_id).slice(-6);
      });
  
      // Apply transaction type filter
      if (this.filterByType) {
        if (this.selectedTransactionType === 'credit') {
          this.ledgerToView = this.ledgerToView.filter((ledger: any) => ledger.amountCredit > 0);
        } else {
          this.ledgerToView = this.ledgerToView.filter((ledger: any) => ledger.amountDebit > 0);
        }
      }

      this.closingBalance();
    });
  }

  openContent() {
    this.Toggledata = !this.Toggledata;
  }

  totalDebit() {
    let total = 0;
    if (this.ledgerToView === null) {
      return 0;
    }
    this.ledgerToView.forEach((ledger: any) => {
      total += ledger.amountDebit;
    });
    return total;
  }

  totalCredit() {
    let total = 0;
    if (this.ledgerToView === null) {
      return 0;
    }
    this.ledgerToView.forEach((ledger: any) => {
      total += ledger.amountCredit;
    });
    return total;
  }

  closingBalance() {
    if((this.totalCredit() - this.totalDebit()) < 0){
      this.isBalanceNegative = true;
      this.closingBalanceAmount = this.totalDebit() - this.totalCredit();
    } else {
      this.isBalanceNegative = false;
      this.closingBalanceAmount = this.totalCredit() - this.totalDebit();
    }
  }

  isCredit: boolean = true;
  isDebit: boolean = true;

  toggleCredit() {
    this.isCredit = !this.isCredit;
    this.updateLedger();
  }

  toggleDebit() {
    this.isDebit = !this.isDebit;
    this.updateLedger();
  }

  updateLedger() {
    if (this.isCredit && this.isDebit) {
      this.data.getLedgerByVID(this.vendorId).subscribe((res: any) => {
        this.ledgerToView = res.data;
        this.ledgerToView.forEach((ledger: any) => {
          ledger.purch_id = ('000000' + ledger.purch_id).slice(-6);
        });
      });
    } else if (this.isCredit) {
      this.data.getCreditedLedger(this.vendorId).subscribe((res: any) => {
        this.ledgerToView = res.data;
        this.ledgerToView.forEach((ledger: any) => {
          ledger.purch_id = ('000000' + ledger.purch_id).slice(-6);
        });
      });
    } else if (this.isDebit) {
      this.data.getDebitiedLedger(this.vendorId).subscribe((res: any) => {
        this.ledgerToView = res.data;
        this.ledgerToView.forEach((ledger: any) => {
          ledger.purch_id = ('000000' + ledger.purch_id).slice(-6);
        });
      });
    } else {
      this.ledgerToView = null;
    }
  }
}
