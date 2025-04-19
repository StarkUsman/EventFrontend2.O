import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, routes } from 'src/app/core/core.index';
import {
  apiResultFormat,
  pageSelection,
  units,
} from 'src/app/core/models/models';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'],
})
export class UnitsComponent {
  public units: Array<any> = [];
  public routes = routes;
  public Toggledata = false;
  isCollapsed = false;
  // pagination variables
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  dataSource!: MatTableDataSource<units>;
  public searchDataValue = '';
  //** / pagination variables
  unitToDelete: number = 0;
  unitToEdit: any = {};
  newUnit: any = {};
  unfilteredData: any = [];

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.voucherList) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getVouchers().subscribe((apiRes: apiResultFormat) => {
      this.units = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: units, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.units.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<units>(this.units);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.units,
        serialNumberArray: this.serialNumberArray,
        tableData2: [],
      });
      this.unfilteredData = structuredClone(apiRes.data);
    });
  }

  public sortData(sort: Sort) {
    const data = this.units.slice();

    if (!sort.active || sort.direction === '') {
      this.units = data;
    } else {
      this.units = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  open() {
    this.Toggledata = !this.Toggledata;
  }

  users = [
    { name: 'Pricilla Maureen', checked: false },
    { name: 'Randall Hollis', checked: false },
  ];

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  setUnitToEdit(unit: any) {
    this.unitToEdit = unit;
  }

  updateUnit() {
    this.data.updateVoucher(this.unitToEdit).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.unitToEdit = {};
    });
  }

  addUnit() {
    this.data.addVoucher(this.newUnit).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.newUnit = {};
    });
  }

  setUnitToDelete(sNo: number) {
    this.unitToDelete = sNo;
  }

  deleteUnit(sNo: number) {
    this.data.deleteVoucher(sNo).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.unitToDelete = 0;
    });
  }

  queryString: string = '';
  async searchCustomers(){
    this.units = structuredClone(this.unfilteredData);
    this.units = this.units.filter((voucher) => {
      return (
        voucher.name?.toLowerCase().includes(this.queryString.toLowerCase()) ||
        voucher.symbol?.toLowerCase().includes(this.queryString.toLowerCase())
      );
    });
  }
}
