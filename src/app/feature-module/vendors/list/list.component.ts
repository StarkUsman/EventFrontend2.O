import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataService, routes } from 'src/app/core/core.index';
import {
  apiResultFormat,
  pageSelection,
  vendor,
} from 'src/app/core/models/models';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  public Toggledata = false;
  public routes = routes;
  public tableData: Array<vendor> = [];
  // pagination variables
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<vendor>;
  public searchDataValue = '';
  vendorToDelete: number = 0;
  vendorToEdit: any = {};
  newVendor: any = {};  
  // pagination variables end
  isAdminLoggedIn = 0;

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.vendorsList) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getVendors().subscribe((apiRes: apiResultFormat) => {
      console.log(apiRes);
      this.tableData = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: vendor, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.tableData.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<vendor>(this.tableData);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.tableData,
        tableData2: [],
        serialNumberArray: this.serialNumberArray,
      });
    });
  }

  public sortData(sort: Sort) {
    const data = this.tableData.slice();

    if (!sort.active || sort.direction === '') {
      this.tableData = data;
    } else {
      this.tableData = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  openContent() {
    this.Toggledata = !this.Toggledata;
  }
  isCollapsed = false;
  users = [
    { name: 'Pricilla Maureen', checked: false },
    { name: 'Randall Hollis', checked: false },
  ];

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  setVendorToEdit(sNo: number) {
    this.vendorToEdit = this.tableData.find((vendor) => vendor.sNo === sNo);
  }

  nameError = false;

  updateVendor() {
    if (!this.vendorToEdit.name || this.vendorToEdit.name.trim() === '') {
      this.nameError = true;
      return;
    }
    
    this.nameError = false;

    this.data.updateVendor(this.vendorToEdit).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
    });
  }


  addVendor() {
    if (!this.newVendor.name || this.newVendor.name.trim() === '') {
      this.nameError = true;
      return;
    }
  
    this.nameError = false;

    this.data.addVendor(this.newVendor).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.newVendor = {};
    });
  }  

  setVendorToDelete(sNo: number) {
    this.vendorToDelete = sNo;
  }

  deleteVendor(sNo: number) {
    this.data.deleteVendor(sNo).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
    });
  }
}
