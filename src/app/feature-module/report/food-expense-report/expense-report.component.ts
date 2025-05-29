import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { routes } from 'src/app/core/helpers/routes/routes';
import {
  apiResultFormat,
  expensereport,
  pageSelection,
} from 'src/app/core/models/models';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-expense-report',
  templateUrl: './expense-report.component.html',
  styleUrls: ['./expense-report.component.scss'],
})
export class ExpenseReportComponent implements OnInit {
  @ViewChild('reportTable') reportTable!: ElementRef<HTMLTableElement>;
  isCollapsed = false;
  showFilter = false;
  public Toggledata = false;
  public routes = routes;
  public expensereport: Array<any> = [];
  // pagination variables
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  dataSource!: MatTableDataSource<expensereport>;
  public searchDataValue = '';
  //** / pagination variables
  startDate: string = '';
  endDate: string = '';
  allSubCategories: any = [];
  unfilteredData: Array<any> = [];
  salaryExpense: Array<any> = [];
  unfilteredSalExpense: Array<any> = [];
  accountExpense: Array<any> = [];
  accountExpenseUnfiltered: Array<any> = [];

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.foodexpenseReport) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
  }

  ngOnInit(): void {
    // this.data.getExpenseAccountCategory().subscribe((res: any) => {
    //   this.allSubCategories = res.subcategory;
    //   for (const subCategory of this.allSubCategories) {
    //     subCategory.checked = true;
    //   }
    // })
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getInventoryExpense().subscribe((apiRes: apiResultFormat) => {
      this.expensereport = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (true) {
          res.sNo = serialNumber;
          res.checked = true;
          this.expensereport.push(res);
          this.serialNumberArray.push(serialNumber);
          res.totalExpense = 0;
          res.totalQuantity = 0;
          for (const ledger of res.ledger) {
            res.totalQuantity -= ledger.quantity;
            ledger.expense = ledger.quantity * ledger.purchasePrice;
            res.totalExpense -= ledger.quantity * ledger.purchasePrice;
          }
          res.totalExpense = res.totalExpense.toFixed(2);
        }
      });
      this.dataSource = new MatTableDataSource<any>(
        this.expensereport,
      );
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.expensereport,
        serialNumberArray: this.serialNumberArray,
        tableData2: [],
      });
      this.unfilteredData = structuredClone(apiRes.data);
    });

    this.data.getSalaryHistory().subscribe((apiRes: apiResultFormat) => {
      this.salaryExpense = [];
      this.salaryExpense = apiRes.data;
      this.unfilteredSalExpense = structuredClone(this.salaryExpense);

      this.salaryExpense = this.consolidateSalaryHistory(this.salaryExpense);
    });

    this.data.getExpense().subscribe((apiRes: apiResultFormat) => {
      this.accountExpense = [];
      apiRes.data = apiRes.data.filter((item: any) => item.subcategory?.toLowerCase() === 'event expense');
      apiRes.data.forEach((res: any, index: number) => {
        res.totalExpense = 0;
        for (const ledger of res.ledger) {
          res.totalExpense += ledger.amountDebit;
        }
        res.totalExpense = res.totalExpense.toFixed(2);
        this.accountExpense.push(res);
      });
      this.accountExpenseUnfiltered = structuredClone(this.accountExpense);
    });
  }

  consolidateSalaryHistory(salaryHistory: any[]): any[] {
    const grouped = new Map<string, any>();

    for (const entry of salaryHistory) {
      const vendorKey = `${entry.vendor.id}_${entry.vendor.name}`;
      if (!grouped.has(vendorKey)) {
        grouped.set(vendorKey, {
          vendor: entry.vendor,
          numberOfPersons: 0,
          totalAmount: 0,
          rateSum: 0,
          rateCount: 0,
          Dated: entry.Dated,
        });
      }

      const group = grouped.get(vendorKey);
      group.numberOfPersons += entry.numberOfPersons;
      group.totalAmount += entry.totalAmount;
      group.rateSum += entry.rate;
      group.rateCount += 1;
    }

    // Finalize objects with averaged rate
    const consolidated = Array.from(grouped.values()).map(group => ({
      vendor: group.vendor,
      numberOfPersons: group.numberOfPersons,
      totalAmount: group.totalAmount,
      rate: +(group.rateSum / group.rateCount).toFixed(2),
      Dated: group.Dated,
    }));

    return consolidated;
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.expensereport = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.expensereport.slice();

    if (!sort.active || sort.direction === '') {
      this.expensereport = data;
    } else {
      this.expensereport = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  isCollapsed1 = false;
  isCollapsed2 = false;

  openContent() {
    this.Toggledata = !this.Toggledata;
  }
  users = [
    { name: 'Sumo Soft Limited', checked: false },
    { name: 'Repair Group Co', checked: false },
  ];

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }
  users2 = [
    { name: 'Stationary', checked: false },
    { name: 'Medical', checked: false },
    { name: 'Designing', checked: false },
  ];

  closingExpenseDate(){
    if(this.endDate){
      return this.endDate;
    } else {
      // return today's Pakistan date
      const today = new Date();
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const formatter = new Intl.DateTimeFormat('en-PK', options);
      const parts = formatter.formatToParts(today);
      const formattedDate = `${parts[2].value}-${parts[0].value}-${parts[4].value}`;
      return formattedDate;
    }
  }

  totalDebit() {
    let total = 0;
    for (const vendor of this.expensereport) {
      total += parseFloat(vendor.totalExpense);
    }
    return total.toFixed(2);
  }

  totalSalaryDebit(){
    let total = 0;
    for (const salary of this.salaryExpense) {
      total += parseFloat(salary.totalAmount);
    }
    return total.toFixed(2);
  }

  totalAccountExpense() {
    let total = 0;
    for (const vendor of this.accountExpense) {
      total += parseFloat(vendor.totalExpense);
    }
    return total.toFixed(2);
  }

  grandTotal() {
    return (Number(this.totalDebit()) + Number(this.totalSalaryDebit()) + Number(this.totalAccountExpense())).toFixed(2);
  }

  getDateRange(startStr: string, endStr: string): [Date, Date] {
    const start = new Date(startStr);
    const end = new Date(endStr);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  }  

  filterData() {
    this.expensereport = structuredClone(this.unfilteredData);
    
    //filter the products and get the products where product.checked is true
    this.expensereport = this.expensereport.filter((product: any) => 
      product.checked
    );

    if (this.startDate && this.endDate) {
      const [start, end] = this.getDateRange(this.startDate, this.endDate);
      
        const filteredProducts = this.expensereport.map((product: any)=>{
          const filteredLedger = product.ledger.filter((entry: any)=>{
            const entryDate = new Date(entry.createdAt);
            return entryDate >= start && entryDate <= end;
          })
          
            const totalExpense = filteredLedger.reduce(
              (sum: number, entry: any) => sum + entry.expense,
              0
            );
            const totalQuantity = filteredLedger.reduce(
              (sum: number, entry: any) => sum + entry.quantity,
              0
            );
            return{
              ...product,
              ledger: filteredLedger,
              totalQuantity,
              totalExpense,
            }
        });
        this.expensereport = filteredProducts;
        
        this.salaryExpense = structuredClone(this.unfilteredSalExpense);
        this.salaryExpense = this.salaryExpense.filter((salary: any) => {
          const salaryDate = new Date(salary.Dated);
          return salaryDate >= start && salaryDate <= end;
        });

        this.salaryExpense = this.consolidateSalaryHistory(this.salaryExpense);

        const filteredVendors = this.accountExpenseUnfiltered.map((vendor: any) => {
          const filteredLedger = vendor.ledger.filter((entry: any) => {
            const entryDate = new Date(entry.createdAt);
            return entryDate >= start && entryDate <= end;
          });

          const totalExpense = filteredLedger.reduce(
            (sum: number, entry: any) => sum + entry.amountDebit,
            0
          );

          return {
            ...vendor,
            ledger: filteredLedger,
            totalExpense,
          };
        });

        this.accountExpense = filteredVendors;
    }
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
    anchor.setAttribute('download', 'foodExpense_export.csv');
    anchor.click();
    URL.revokeObjectURL(url);
  }

}
