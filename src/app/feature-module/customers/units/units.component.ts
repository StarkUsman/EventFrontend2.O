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

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.vendorSubCategory) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getAccountsSubCategory().subscribe((apiRes: apiResultFormat) => {
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

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  setUnitToEdit(unit: any) {
    this.unitToEdit = unit;
  }

  updateUnit() {
    this.data.updateaSubCategory(this.unitToEdit).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.unitToEdit = {};
    });
  }

  addUnit() {
    this.data.addaSubCategory(this.newUnit).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.newUnit = {};
    });
  }

  setUnitToDelete(sNo: number) {
    this.unitToDelete = sNo;
  }

  deleteUnit(sNo: number) {
    this.data.deleteaSubCategory(sNo).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.unitToDelete = 0;
    });
  }
}
