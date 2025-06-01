import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})

export class ProfitLossReportService {
  yearMonth: string = '';
  reportData: any[] = [];
  foodExpenseLedger: any[] = [];
  salariesLedger: any[] = [];
  expenseLedger: any[] = [];
  monthlyExpenseLedger: any[] = [];
  services: any[] = [];
  prevMonth: string = '';

  constructor(private data: DataService) {}

  async init(): Promise<void> {
    const now = new Date();
    this.yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    await this.loadData();
    this.saveProfitLoss(); // call when data is loaded
  }

  private async loadData(): Promise<void> {
    const reservations:any = await this.data.getReservationsByMonth(this.yearMonth).toPromise();
    this.reportData = reservations.data;
    this.setServices();

    const foodRes:any = await this.data.getVendorByName("FOOD EXPENSE").toPromise();
    const foodLedger:any = await this.data.getLedgerByVID(foodRes.vendor_id).toPromise();
    this.foodExpenseLedger = foodLedger.data.filter((item: any) => item.createdAt.startsWith(this.yearMonth));

    const salaryLedger:any = await this.data.getLedgerByName("SALARY").toPromise();
    this.salariesLedger = salaryLedger.data.filter((item: any) => item.createdAt.startsWith(this.yearMonth));

    const expenseCategories:any = await this.data.getVendorFoodCategory().toPromise();
    this.expenseLedger = [];
    for (let item of expenseCategories.data) {
      const ledger:any = await this.data.getLedgerByVID(item.id).toPromise();
      ledger.data.forEach((l: any) => {
        if (l.createdAt.startsWith(this.yearMonth)) {
          this.expenseLedger.push(l);
        }
      });
    }

    const monthlyVendors:any = await this.data.getVendorMonthlyExpense().toPromise();
    this.monthlyExpenseLedger = [];
    for (let item of monthlyVendors.data) {
      const ledger:any = await this.data.getLedgerByVID(item.id).toPromise();
      ledger.data.forEach((l: any) => {
        if (l.createdAt.startsWith(this.yearMonth)) {
          this.monthlyExpenseLedger.push(l);
        }
      });
    }
  }

  setServices() {
    this.services = [];
    this.reportData.forEach((item: any) => {
      item.additional_services.forEach((service: any) => {
        const existing = this.services.find((s) => s.additional_service_name === service.additional_service_name);
        if (existing) {
          existing.totalPrice += service.totalPrice;
        } else if (["Audio System", "Stage Decor"].includes(service.additional_service_name)) {
          return;
        } else {
          this.services.push(service);
        }
      });
    });
  }

  closingFoodAmount() {
    return this.reportData.reduce((sum, item) => sum + (item.selectedMenu?.finalPrice || 0), 0);
  }

  grandInflow() {
    const serviceTotal = this.services.reduce((sum, s) => sum + s.totalPrice, 0);
    return serviceTotal + this.closingFoodAmount();
  }

  totalExpense() {
    const sumLedger = (arr: any[]) => arr.reduce((sum, item) => sum + (item.amountDebit - item.amountCredit), 0);
    return sumLedger(this.foodExpenseLedger) + sumLedger(this.salariesLedger) + sumLedger(this.expenseLedger);
  }

  totalDiscount() {
    return this.reportData.reduce((sum, item) => sum + (item.discount || 0), 0);
  }

  grossProfit() {
    return this.grandInflow() - this.totalDiscount() - this.totalExpense();
  }

  monthlyDevExpense() {
    return this.monthlyExpenseLedger.reduce((sum, item) => sum + (item.amountDebit - item.amountCredit), 0);
  }

  netProfit() {
    return this.grossProfit() - this.monthlyDevExpense();
  }

  saveProfitLoss() {
    if (this.prevMonth === '' || this.prevMonth !== this.yearMonth) {
      this.prevMonth = this.yearMonth;
      const profitLoss = {
        totalExpense: this.totalExpense() + this.monthlyDevExpense() + this.totalDiscount(),
        totalIncome: this.grandInflow(),
        profitLoss: this.netProfit(),
        monthName: this.yearMonth.split('-')[1]
      };
      this.data.saveProfitLoss(profitLoss).subscribe();
    }
  }
}
