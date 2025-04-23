import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { routes, DataService } from 'src/app/core/core.index';
@Component({
  selector: 'app-inventory-history',
  templateUrl: './inventory-history.component.html',
  styleUrls: ['./inventory-history.component.scss'],
})
export class InventoryHistoryComponent implements OnInit {
  public routes = routes;
  public Toggledata = false;
  inventoryLedgerToView: any = [];
  inventoryToView: any = {};
  productId: any;
  filterByDate: boolean = false;
  filterByName: boolean = false;
  startDate: string = '';
  endDate: string = '';
  user: any = {};
  isQuantityNegative: boolean = false;
  closingQuantity: number = 0;
  closingQuantityDate: string = new Date().toLocaleDateString();
  filterByType: boolean = false;
  selectedLedgerType: string = 'stockIn'; // stockIn or stockOut

  constructor(private route: ActivatedRoute, private data: DataService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let id = params['id'];
      this.productId = id;
      this.data.getInventoryLedgerByPID(id).subscribe((res: any) => {
        this.inventoryLedgerToView = res.data;
        this.inventoryLedgerToView.forEach((ledger: any, index: number) => {
          ledger.voucher = ('000000' + ledger.voucher).slice(-6);
          if (index === 0) {
            ledger.quantity = ledger.stockIn || -ledger.stockOut;
          } else {
            ledger.quantity = ledger.stockIn
              ? this.inventoryLedgerToView[index - 1].quantity + ledger.stockIn
              : this.inventoryLedgerToView[index - 1].quantity - ledger.stockOut;
          }
        });
        this.calClosingQuantity();
      });
      this.data.getProductById(id).subscribe((res: any) => {
        this.inventoryToView = res;
      });
    });
  }

  resetFilters(){
    this.filterByDate = false;
    this.filterByName = false;
    this.startDate = '';
    this.endDate = '';
    this.user.userName = '';
    this.isStockIn = true;
    this.isStockOut = true;
    this.updateLedger();
  }

  applyFilters() {
    if (this.endDate && this.endDate !== '') {
      this.closingQuantityDate = this.endDate;
    }
  
    // Fetch filtered ledger data based on selected filters
    this.data.getInventoryFilteredLedger(this.productId, this.startDate, this.endDate, this.user.userName).subscribe((res: any) => {
      this.inventoryLedgerToView = res.data;
      this.inventoryLedgerToView.forEach((ledger: any) => {
        ledger.voucher = ('000000' + ledger.voucher).slice(-6);
      });
  
      // Apply transaction type filter
      if (this.filterByType) {
        if (this.selectedLedgerType === 'stockIn') {
          this.inventoryLedgerToView = this.inventoryLedgerToView.filter((ledger: any) => ledger.stockIn > 0);
        } else {
          this.inventoryLedgerToView = this.inventoryLedgerToView.filter((ledger: any) => ledger.stockOut > 0);
        }
      }

      this.calClosingQuantity();
    });
  }

  openContent() {
    this.Toggledata = !this.Toggledata;
  }

  totalStockOut() {
    let total = 0;
    if (this.inventoryLedgerToView === null) {
      return 0;
    }
    this.inventoryLedgerToView.forEach((ledger: any) => {
      total += ledger.stockOut;
    });
    return total;
  }

  totalStockIn() {
    let total = 0;
    if (this.inventoryLedgerToView === null) {
      return 0;
    }
    this.inventoryLedgerToView.forEach((ledger: any) => {
      total += ledger.stockIn;
    });
    return total;
  }

  calClosingQuantity() {
    if((this.totalStockIn() - this.totalStockOut()) < 0){
      this.isQuantityNegative = true;
      this.closingQuantity = this.totalStockOut() - this.totalStockIn();
    } else {
      this.isQuantityNegative = false;
      this.closingQuantity = this.totalStockIn() - this.totalStockOut();
    }
  }

  isStockIn: boolean = true;
  isStockOut: boolean = true;

  toggleStockIn() {
    this.isStockIn = !this.isStockIn;
    this.updateLedger();
  }

  toggleStockOut() {
    this.isStockOut = !this.isStockOut;
    this.updateLedger();
  }

  updateLedger() {
    if (this.isStockIn && this.isStockOut) {
      this.data.getInventoryLedgerByPID(this.productId).subscribe((res: any) => {
        this.inventoryLedgerToView = res.data;
        this.inventoryLedgerToView.forEach((ledger: any) => {
          ledger.voucher = ('000000' + ledger.voucher).slice(-6);
        });
      });
    } else if (this.isStockIn) {
      this.data.getInventoryStockInLedger(this.productId).subscribe((res: any) => {
        this.inventoryLedgerToView = res.data;
        this.inventoryLedgerToView.forEach((ledger: any) => {
          ledger.voucher = ('000000' + ledger.voucher).slice(-6);
        });
      });
    } else if (this.isStockOut) {
      this.data.getInventoryStockOutLedger(this.productId).subscribe((res: any) => {
        this.inventoryLedgerToView = res.data;
        this.inventoryLedgerToView.forEach((ledger: any) => {
          ledger.voucher = ('000000' + ledger.voucher).slice(-6);
        });
      });
    } else {
      this.inventoryLedgerToView = null;
    }
  }
}
