import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, routes } from 'src/app/core/core.index';
import {
  apiResultFormat,
  pageSelection,
  purchase,
} from 'src/app/core/models/models';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
})
export class ExpensesListComponent  {
  public routes = routes;
  public purchase: Array<purchase> = [];

  public Toggledata = false;
  // pagination variables
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  dataSource!: MatTableDataSource<purchase>;
  public searchDataValue = '';
  //** / pagination variables
  itemToDetele: number = 0;
  unfilteredData: any = [];

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.expensesList) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
  }

  private getTableData(pageOption: pageSelection): void {
    const options: Intl.DateTimeFormatOptions = { 
      timeZone: 'Asia/Karachi', 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
  };

    this.data.getExpenses().subscribe((apiRes: apiResultFormat) => {
      this.purchase = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: purchase, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          res.purchase_date = new Date(res.purchase_date).toLocaleString('en-US', options);
          this.purchase.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<purchase>(this.purchase);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.purchase,
        serialNumberArray: this.serialNumberArray,
        tableData2: [],
      });
      this.unfilteredData = structuredClone(apiRes.data);
    });
  }

  public sortData(sort: Sort) {
    const data = this.purchase.slice();

    if (!sort.active || sort.direction === '') {
      this.purchase = data;
    } else {
      this.purchase = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  isCollapsed1 = false;

  users1 = [
    { name: 'Pricilla', checked: false },
    { name: 'Randall', checked: false },
  ];

  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  public toggleData = false;
  openContent() {
    this.toggleData = !this.toggleData;
  }

  setItemToDelete(purchase: any){
    this.itemToDetele = purchase.id;
  }

  // deleteItem(){
  //   this.data.deletepurchase(this.itemToDetele).subscribe((res: any) => {
  //     this.getTableData({ skip: 0, limit: this.pageSize });
  //   });
  // }

  queryString: string = '';
  async searchCustomers(){
    this.purchase = structuredClone(this.unfilteredData);
    this.purchase = this.purchase.filter((purchase) => {
      return (
        purchase.purch_id?.toString().toLowerCase().includes(this.queryString.toLowerCase()) ||
        purchase.reference_no?.toLowerCase().includes(this.queryString.toLowerCase()) ||
        purchase.total_amount?.toString().toLowerCase().includes(this.queryString.toLowerCase())
        // purchase.code?.toLowerCase().includes(this.queryString.toLowerCase()) ||
      );
    });
  }
}
