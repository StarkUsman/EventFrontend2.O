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

  closingBalanceDate: string = new Date().toLocaleDateString();

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

  applyFilters() {
    this.data.getFilteredLedger(this.vendorId, this.startDate, this.endDate, this.vendorName).subscribe((res: any) => {
      this.ledgerToView = res.data;
      this.ledgerToView.forEach((ledger: any) => {
        ledger.purch_id = ('000000' + ledger.purch_id).slice(-6);
      });
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
    return this.totalDebit() - this.totalCredit();
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
