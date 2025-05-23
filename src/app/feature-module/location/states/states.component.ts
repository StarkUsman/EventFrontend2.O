import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, routes } from 'src/app/core/core.index';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {
  apiResultFormat,
  pageSelection,
  states,
} from 'src/app/core/models/models';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss'],
})
export class StatesComponent implements OnInit {
  control = new FormControl();
  public routes = routes;
  isCollapsed = false;
  name = 'country';
  name1 = 'state';
  public states: Array<states> = [];

  // pagination variables
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  dataSource!: MatTableDataSource<states>;
  public searchDataValue = '';
  //** / pagination variables

  menuItems: any = [];
  menuItemToEdit: any = {};
  newMenuItem: any = {};
  menuItemToDelete: any = {};
  filteredOptions!: Observable<string[]>;
  categories: any = [];
  unfilteredData: any = [];

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.menuItems) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getAllMenuItems().subscribe((apiRes: apiResultFormat) => {
      this.states = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: states, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.states.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<states>(this.states);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.states,
        serialNumberArray: this.serialNumberArray,
        tableData2: [],
      });
      this.unfilteredData = structuredClone(apiRes.data);
    });
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.states = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.states.slice();

    if (!sort.active || sort.direction === '') {
      this.states = data;
    } else {
      this.states = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  isCollapsed1 = false;
  isCollapsed2 = false;

  users = [
    { name: 'Barbara Moore', checked: false },
    { name: 'Hendry Evan', checked: false },
    { name: 'Richard Miles', checked: false },
  ];
  users2 = [
    { name: 'Stationary', checked: false },
    { name: 'Medical', checked: false },
    { name: 'Designing', checked: false },
  ];

  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }
  public toggleData = false;
  openContent() {
    this.toggleData = !this.toggleData;
  }

  ngOnInit(): void {
    this.data.getCategory().subscribe((res: any) => {
      for (let i = 0; i < res.data.length; i++) {
        this.categories.push(res.data[i].category);
      }

      this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      );
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.categories.filter((option: any) => option.toLowerCase().includes(filterValue));
  }

  setMenuItemToEdit(menuItem: any) {
    this.menuItemToEdit = menuItem;
  }

  setMenuItemToDelete(menuItem: any) {
    this.menuItemToDelete = menuItem;
  }

  updateMenuItem() {
    this.data.updateMenuItem(this.menuItemToEdit).subscribe((res: any) => {});
    // window.location.reload();
  }

  addMenuItem() {
    this.data.addMenuItem(this.newMenuItem).subscribe((res: any) => {
      this.newMenuItem = {};
      this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      });
    });
  }

  deleteMenuItem() {
    console.log(this.menuItemToDelete);
    this.data.deleteMenuItem(this.menuItemToDelete).subscribe((res: any) => {});
    this.states = this.states.filter((item) => item !== this.menuItemToDelete);
  }

  queryString: string = '';
  async searchCustomers(){
    this.states = structuredClone(this.unfilteredData);
    this.states = this.states.filter((menuItem) => {
      return (
        menuItem.item_name.toLowerCase().includes(this.queryString.toLowerCase()) ||
        menuItem.item_name_urdu.toLowerCase().includes(this.queryString.toLowerCase()) ||
        menuItem.category.toLowerCase().includes(this.queryString.toLowerCase())
      );
    });
  }
}
