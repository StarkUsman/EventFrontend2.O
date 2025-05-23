import { Component, OnInit } from '@angular/core';
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
export class ListComponent implements OnInit {
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
  isAdminLoggedIn = 0;
  categories: any = [];
  subcategories: any = [];
  unfilteredData: any = [];

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.customerList) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
    let user: any = localStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      if (user && user.role && user.role == 'admin') {
        this.isAdminLoggedIn = 1;
      } else {
        this.isAdminLoggedIn = 0;
      }
    }
  }

  ngOnInit(): void {
    this.getAccountsCategory();
    this.getAccountsSubCategory();
  }

  getAccountsCategory() {
    this.data.getAccountsCategory().subscribe((res) => {
      this.categories = res.data;
    });
  }
  getAccountsSubCategory() {
    this.data.getAccountsSubCategory().subscribe((res) => {
      this.subcategories = res.data;
    });
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getVendors().subscribe((apiRes: apiResultFormat) => {
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
      this.unfilteredData = structuredClone(apiRes.data);
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
    this.vendorToEdit.category = this.categories.find(
      (category: any) => category.category === this.vendorToEdit.category.category
    );
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

    this.data.addVendor(this.newVendor).subscribe((res: any) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      
      if(res && this.newVendor.balance && (parseFloat(this.newVendor.balance) != 0)) {
        this.addLedger(0, res.id, this.newVendor.balance);
      }      
      this.newVendor = {};
    });
  }  

  addLedger(purch_id: any, vendor_id: any, amountCredit: any) {
    let ledger = {
      name: "OB",
      purch_id: purch_id,
      vendor_id: vendor_id,
      amountCredit: 0,
      amountDebit: 0,
    };

    if(parseFloat(amountCredit) > 0) {
      ledger.amountCredit = parseFloat(amountCredit);
    } else {
      ledger.amountDebit = -parseFloat(amountCredit);
    }

    this.data.addLedger(ledger).subscribe((res) => { });
  }

  setVendorToDelete(sNo: number) {
    this.vendorToDelete = sNo;
  }

  deleteVendor(sNo: number) {
    this.data.deleteVendor(sNo).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
    });
  }

  queryString: string = '';
  async searchCustomers(){
    this.tableData = structuredClone(this.unfilteredData);
    this.tableData = this.tableData.filter((vendor) => {
      return (
        vendor.name?.toLowerCase().includes(this.queryString.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(this.queryString.toLowerCase()) ||
        vendor.phone?.toLowerCase().includes(this.queryString.toLowerCase())
      );
    });
  }
}
