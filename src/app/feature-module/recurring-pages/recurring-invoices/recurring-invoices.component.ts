import { forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, routes } from 'src/app/core/core.index';
import {
  apiResultFormat,
  pageSelection,
  category,
} from 'src/app/core/models/models';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-recurring-invoices',
  templateUrl: './recurring-invoices.component.html',
  styleUrls: ['./recurring-invoices.component.scss'],
})
export class RecurringInvoicesComponent implements OnInit {

  accountControl = new FormControl();
  menuItemControl = new FormControl();
  filteredAccountOptions!: Observable<string[]>;
  accountNames: any = [];
  filteredMenuItemsOptions!: Observable<string[]>;
  menuItemNames: any = [];

  public salaries: Array<any> = [];
  public routes = routes;
  public Toggledata = false;
  isCollapsed = false;
  // pagination variables
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  dataSource!: MatTableDataSource<any>;
  public searchDataValue = '';
  //** / pagination variables
  allAccounts: any = [];
  allMenuItems: any = [];
  newSalary: any = {};
  salaryToEdit: any = {};
  salaryToDelete: any = {};
  menuItemsSelected: any = [];
  allSalaries: any = [];

  constructor(private data: DataService, private pagination: PaginationService , private router: Router) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.salariesList) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
  }

  ngOnInit(): void {
    this.loadMenuItems();
    this.getAllCalculatedSalaries();
  }

  loadMenuItems(){
    this.allMenuItems = [];
    this.menuItemNames = [];
    this.data.getAllMenuItems().subscribe((res: any) => {
      this.allMenuItems = res.data;
      for (let i = 0; i < res.data.length; i++) {
        delete res.data[i].sNo;
        this.menuItemNames.push(res.data[i].item_name);
      }

      this.filteredMenuItemsOptions = this.menuItemControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterM(value || '')),
      );
    });
  }

  private _filterA(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.accountNames.filter((option: any) => option.toLowerCase().includes(filterValue));
  }

  private _filterM(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.menuItemNames.filter((option: any) => option.toLowerCase().includes(filterValue));
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getSalary().subscribe((apiRes: apiResultFormat) => {
      this.salaries = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.salaries.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<any>(this.salaries);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.salaries,
        serialNumberArray: this.serialNumberArray,
        tableData2: [],
      });

      this.getVendorList();
    });
  }

  getVendorList() {
    this.data.getVendors().subscribe((res: any) => {
      this.accountNames = [];
      this.allAccounts = res.data;
      // remove the object from allAccounts array if its name matches salary.vendor.name from salaries array
      this.salaries.forEach((salary: any) => {
        this.allAccounts = this.allAccounts.filter((account: any) => account.name !== salary.vendor.name);
      });

      for (let i = 0; i < this.allAccounts.length; i++) {
        this.accountNames.push(this.allAccounts[i].name);
      }

      this.filteredAccountOptions = this.accountControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterA(value || '')),
      );
    });
  }

  public sortData(sort: Sort) {
    const data = this.salaries.slice();

    if (!sort.active || sort.direction === '') {
      this.salaries = data;
    } else {
      this.salaries = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  onAccountSelected(event: any) {
    if(this.salaryToEdit.id){
      this.salaryToEdit.vendor = this.allAccounts.find((account: any) => account.name === event);
    } else{
      this.newSalary.vendor = this.allAccounts.find((account: any) => account.name === event);
    }
  }

  addMenuItem(menuItem: any) {
    let menuItemToPush = this.allMenuItems.find((item: any) => item.item_name === menuItem);
    delete menuItemToPush.sNo;
    this.menuItemsSelected.push(menuItemToPush);

    this.menuItemNames = this.menuItemNames.filter((item: any) => item!== menuItem);
    setTimeout(() => {
      this.menuItemControl.setValue('');
    });
  }

  removeMenuItem(menuItem: any) {
    this.menuItemsSelected = this.menuItemsSelected.filter((item: any) => item!== menuItem);
    this.menuItemNames.push(menuItem.item_name);
    this.filteredMenuItemsOptions = this.menuItemControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterM(value || '')),
    );
  }

  setSalaryToEdit(salary: any) {
    this.salaryToEdit = salary;
    this.salaryToEdit.account = this.salaryToEdit.vendor.name;
    this.menuItemsSelected = this.salaryToEdit.menuItems;
    this.menuItemNames = this.allMenuItems.map((item: any) => item.item_name);
    this.menuItemNames = this.menuItemNames.filter((item: any) => {
      return !this.menuItemsSelected.some((selectedItem: any) => selectedItem.item_name === item);
    });
    this.filteredMenuItemsOptions = this.menuItemControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterM(value || '')),
    );
  }

  setSalaryToDelete(salary: any) {
    this.salaryToDelete = salary;
  }

  addSalary() {
    delete this.newSalary.account;
    delete this.newSalary.vendor?.category;
    this.newSalary.menuItems = this.menuItemsSelected;
    this.data.addSalary(this.newSalary).subscribe((res: any) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.loadMenuItems();
      this.newSalary = {};
      this.menuItemsSelected = [];
      this.accountControl.setValue('');
      this.menuItemControl.setValue('');
      window.location.reload();
    });
  }

  updateSalary() {
    this.salaryToEdit.menuItems = this.menuItemsSelected;
    this.data.updateSalary(this.salaryToEdit).subscribe((res: any) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.loadMenuItems();
      this.salaryToEdit = {};
      this.menuItemsSelected = [];
      this.accountControl.setValue('');
      this.menuItemControl.setValue('');
    });
  }

  deleteSalary() {
    this.data.deleteSalary(this.salaryToDelete.id).subscribe((res: any) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.salaryToDelete = {};
      this.menuItemsSelected = [];
      this.accountControl.setValue('');
      this.menuItemControl.setValue('');
    });
  }

  lastSalaryPaidDate: any = new Date();
  totalSalary: any = 0;
  getAllCalculatedSalaries() {
    this.data.getAllCalculatedSalaries().subscribe((res: any) => {
      this.allSalaries = res;
      this.allSalaries = this.allSalaries.filter((salary: any) => salary.totalSalaryCalculated > 0);

      this.lastSalaryPaidDate = this.allSalaries[0]?.lastSalaryPaidDate;
      this.allSalaries.forEach((salary: any) => {
        this.totalSalary += salary.totalSalaryCalculated;
      });
    });
  }

  addLedger(salary: any) {

    let ledger = {
      name: "Salary",
      purch_id: salary.id,
      vendor_id: salary.vendor.id,
      amountDebit: salary.totalSalaryCalculated,
      amountCredit: 0
    };

    this.data.addLedger(ledger).subscribe((res) => { });
  }

  salaryHistory: any = [];

  addSalaryHistory(salaryHistory: any[]): Observable<any> {
    const historyObservables = salaryHistory.map((salary: any) =>
      this.data.addSalaryHistory(salary)
    );
    return forkJoin(historyObservables);
  }

  paySalary() {
    this.salaryHistory = [];
    this.allSalaries.filter((salary: any) => salary.totalSalaryCalculated > 0).forEach((salary: any) => {
      let salaryHistoryObject = {
        vendor: salary.vendor,
        numberOfPersons: salary.number_of_persons_sum,
        rate: salary.rate,
        totalAmount: salary.totalSalaryCalculated,
      }
      this.salaryHistory.push(salaryHistoryObject);
    });

    this.allSalaries.forEach((salary: any) => {
      this.addLedger(salary);
    });

    let salariesToUpdate = this.salaries.map((salary: any) => {
      return this.allSalaries.find((s: any) => s.id === salary.id) ? salary : null;
    }).filter(s => s !== null);

    const today = new Date().toISOString().split('T')[0];
    salariesToUpdate.forEach((salary: any) => {
      salary.lastSalaryPaidDate = today;
    });

    const updateObservables = salariesToUpdate.map((salary: any) => this.data.updateSalary(salary));

    forkJoin(updateObservables).subscribe({
      next: () => {
        if (this.salaryHistory.length > 0) {
          this.addSalaryHistory(this.salaryHistory).subscribe({
            next: () => {
              window.location.reload();
            },
            error: (err) => {
              console.error("Error adding salary history", err);
            },
          });
        } else {
          window.location.reload();
        }
      },
      error: (err) => {
        console.error("Error updating salaries", err);
      },
    });
  }

}
