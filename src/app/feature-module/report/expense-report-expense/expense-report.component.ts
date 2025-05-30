import { Component, OnInit } from '@angular/core';
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
  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.expenseReportAll) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
  }

  ngOnInit(): void {
    // this.data.getExpenseAccountCategory().subscribe((res: any) => {
    //   this.allSubCategories = res.subcategory;
    //   for (const subCategory of this.allSubCategories) {
    //     if (subCategory.subcategory.toLowerCase() === 'eventexpense') {
    //       subCategory.checked = true;
    //     } else {
    //       subCategory.checked = false;
    //     }
    //   }
    //   this.filterData();
    // })
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getExpenses().subscribe((apiRes: apiResultFormat) => {
      this.expensereport = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (true) {
          res.sNo = serialNumber;
          this.expensereport.push(res);
          this.serialNumberArray.push(serialNumber);
        }
        const date = new Date(res.purchase_date);

        // Format to "YYYY-MM-DD HH:mm:ss"
        res.purchase_date = date.getFullYear() + "-" +
          String(date.getMonth() + 1).padStart(2, '0') + "-" +
          String(date.getDate()).padStart(2, '0') + " " +
          String(date.getHours()).padStart(2, '0') + ":" +
          String(date.getMinutes()).padStart(2, '0') + ":" +
          String(date.getSeconds()).padStart(2, '0');

        res.dateOnly = date.getFullYear() + "-" +
          String(date.getMonth() + 1).padStart(2, '0') + "-" +
          String(date.getDate()).padStart(2, '0');
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
    for (const purchase of this.expensereport) {
      total += parseFloat(purchase.total_amount);
    }
    return total.toFixed(2);
  }

  getDateRange(startStr: string, endStr: string): [Date, Date] {
    const start = new Date(startStr);
    const end = new Date(endStr);
    end.setHours(23, 59, 59, 999);
    return [start, end];
  }  

  filterData() {
    this.expensereport = structuredClone(this.unfilteredData);

    if (this.startDate && this.endDate) {
      const [start, end] = this.getDateRange(this.startDate, this.endDate);

      const filteredExpense = this.expensereport.filter((purchase: any) => {
        const purchaseDate = new Date(purchase.purchase_date);
        return purchaseDate >= start && purchaseDate <= end;
      });

      this.expensereport = filteredExpense;
    }
  }
}
