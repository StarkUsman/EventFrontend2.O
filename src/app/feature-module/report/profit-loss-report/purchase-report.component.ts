import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { D } from '@fullcalendar/core/internal-common';
import { routes } from 'src/app/core/helpers/routes/routes';
import {
  apiResultFormat,
  pageSelection,
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
  endDate: string = '';
  yearMonth: string = '';
  foodExpenseLedger: any[] = [];
  reportData: any[] = [];
  services: any[] = [];
  salariesLedger: any[] = [];
  expenseLedger: any[] = [];
  monthlyExpenseLedger: any[] = [];
  unfilteredData: any[] = [];

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.profitLoss) {
        // lets get the current year and month as 2025-05
        const now = new Date();
        this.yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        this.getTableData();
        setTimeout(() => {
          this.saveProfitLoss();
        }, 10000); 
      }
    });
  }

  ngOnInit(): void {
  }

  private getTableData(): void {

    this.data.getReservationsByMonth(this.yearMonth).subscribe((apiRes: apiResultFormat) => {
      this.reportData = apiRes.data;
      this.setServices();
    });
    
    this.data.getVendorByName("FOOD EXPENSE").subscribe((res: any) => {
      this.data.getLedgerByVID(res.vendor_id).subscribe((apiRes: any) => {
        this.foodExpenseLedger = apiRes.data.filter((item: any) => {
          return item.createdAt.startsWith(this.yearMonth);
        });
      });
    });
    
    this.data.getLedgerByName("SALARY").subscribe((apiRes: any) => {
      this.salariesLedger = apiRes.data;
      this.salariesLedger = this.salariesLedger.filter((item: any) => {
        return item.createdAt.startsWith(this.yearMonth);
      });
    });

    this.expenseLedger = [];
    this.data.getVendorFoodCategory().subscribe((res: any) => {
      res.data.forEach((item: any) => {
        this.data.getLedgerByVID(item.id).subscribe((apiRes: any) => {
          apiRes.data.forEach((ledgerItem: any) => {
            if (ledgerItem.createdAt.startsWith(this.yearMonth)) {
              this.expenseLedger.push(ledgerItem);
            }
          });
        });
      });
    });

    this.monthlyExpenseLedger = [];
    this.data.getVendorMonthlyExpense().subscribe((res: any) => {
      res.data.forEach((item: any) => {
        this.data.getLedgerByVID(item.id).subscribe((apiRes: any) => {
          apiRes.data.forEach((ledgerItem: any) => {
            if (ledgerItem.createdAt.startsWith(this.yearMonth)) {
              this.monthlyExpenseLedger.push(ledgerItem);
            }
          });
        });
      });
    });
  }

  setServices() {
    this.services = [];
    this.reportData.forEach((item: any) => {
      item.additional_services.forEach((service: any) => {
        const existingService = this.services.find((s) => s.additional_service_name === service.additional_service_name);
        if (existingService) {
          //skip if the service is already in the list
            return;
        } else {
          this.services.push(service);
        }
      });
    });
  }

  closingFoodAmount(){
    let total = 0;
    this.reportData.forEach((item: any) => {
      total += item.selectedMenu?.finalPrice;
    });
    return total;
  }
  grandInflow(){
    let total = 0;
    this.services.forEach((item: any) => {
      total += item.totalPrice;
    });

    return total+ this.closingFoodAmount();
  }
  totalExpense(){
    let total = 0;
    this.foodExpenseLedger.forEach((item: any) => {
      total += item.amountDebit - item.amountCredit;
    });
    
    this.salariesLedger.forEach((item: any) => {
      total += item.amountDebit - item.amountCredit;
    });
    
    this.expenseLedger.forEach((item: any) => {
      total += item.amountDebit - item.amountCredit;
    });
    
    return total;
  }
  totalDiscount(){
    let total = 0;
    this.reportData.forEach((item: any) => {
      total += item.discount;
    });
    return total;
  }

  grossProfit(){
    return this.grandInflow() - this.totalDiscount() - this.totalExpense();
  }
  monthlyDevExpense(){
    let total = 0;
    this.monthlyExpenseLedger.forEach((item: any) => {
      total += item.amountDebit - item.amountCredit;
    });
    return total;
  }
  netProfit(){
    return this.grossProfit() - this.monthlyDevExpense();
  }
  
  prevMonth: string = '';
  saveProfitLoss() {
    if (this.prevMonth === '' || this.prevMonth !== this.yearMonth) {
      this.prevMonth = this.yearMonth;
      let profitLoss = {
        totalExpense: this.totalExpense() + this.monthlyDevExpense() + this.totalDiscount(),
        totalIncome: this.grandInflow(),
        profitLoss: this.grandInflow() - (this.totalExpense() + this.monthlyDevExpense() + this.totalDiscount()),
        monthName: this.yearMonth.split('-')[1]
      }
      this.data.saveProfitLoss(profitLoss).subscribe((res: any) => {});
    }

  }


  filterData() {
    this.getTableData();

    setTimeout(() => {
      this.saveProfitLoss();
    }, 10000); 
  }
}
