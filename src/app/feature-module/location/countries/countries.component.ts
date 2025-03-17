import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, routes } from 'src/app/core/core.index';
import { FormControl } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {
  apiResultFormat,
  countries,
  pageSelection,
} from 'src/app/core/models/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit {
  control = new FormControl();
  public routes = routes;
  isCollapsed = false;
  country = 'India';
  public countries: Array<countries> = [];
  public Toggledata = false;
  // pagination variables
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  dataSource!: MatTableDataSource<countries>;
  public searchDataValue = '';
  //** / pagination variables
  menuItems: any = [];
  filteredOptions!: Observable<string[]>;
  options: any = [];

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.menu) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
  }

  ngOnInit(): void {
    this.getTableData({ skip: 0, limit: this.pageSize });
    this.loadMenuItems();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: any) => option.toLowerCase().includes(filterValue));
  }

  loadMenuItems(){
    this.data.getMenuItems().subscribe((res: any) => {
      this.menuItems = res;
      for (let i = 0; i < res.length; i++) {
        this.options.push(res[i].item_name);
      }
      this.filterSelectedItems();
    })
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getMenus().subscribe((apiRes: apiResultFormat) => {
      this.countries = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: countries, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.countries.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<countries>(this.countries);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.countries,
        serialNumberArray: this.serialNumberArray,
        tableData2: [],
      });
    });
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.countries = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.countries.slice();

    if (!sort.active || sort.direction === '') {
      this.countries = data;
    } else {
      this.countries = data.sort((a, b) => {
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

  menuToEdit: any = {};
  setMenuToEdit(menu: any) {
   this.menuToEdit = {...menu};
   this.loadMenuItems();
  }
  selectedMenuItem: any = {};
  menuItemsSelected: any = [];

  filterSelectedItems(){
    let selectedItemIDs = this.menuToEdit.menu_item_ids;
    this.menuItemsSelected = this.menuItems.filter((item: any) => selectedItemIDs.includes(item.menu_item_id.toString()));
    this.options = this.menuItems.filter((item: any) => !selectedItemIDs.includes(item.menu_item_id.toString())).map((item: any) => item.item_name);
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    )
  }

  addMenuItem(menuItem: any) {
    // this.menuItemsSelected.push(menuItem);
    let menuItemToPush = this.menuItems.find((item: any) => item.item_name === menuItem);
    this.menuItemsSelected.push(menuItemToPush);

    this.options = this.options.filter((item: any) => item!== menuItem);
    setTimeout(() => {
      this.control.setValue('');
    });
  }

  removeMenuItem(menuItem: any) {
    this.menuItemsSelected = this.menuItemsSelected.filter((item: any) => item!== menuItem);
    this.options.push(menuItem.item_name);
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  updateMenu(){
    let menu_item_ids = this.menuItemsSelected.map((item: any) => item.menu_item_id);
    this.menuToEdit.menu_item_ids = menu_item_ids;

    this.data.updateMenu(this.menuToEdit).subscribe((res: any) => {});
    window.location.reload();
  }

  menuToDelete: any = {};
  
  setMenuToDelete(menu: any){
    this.menuToDelete = menu;
  }

  deleteMenu(){
    this.data.deleteMenu(this.menuToDelete.menu_id).subscribe((res: any) => {});
    window.location.reload();
  }

  newMenu: any = {};

  presetMenu(){
    this.options = this.menuItems.map((item: any) => item.item_name);
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    )
  }

  addMenu(){
    let menu_item_ids = this.menuItemsSelected.map((item: any) => item.menu_item_id);
    this.newMenu.menu_item_ids = menu_item_ids;
    this.data.addMenu(this.newMenu).subscribe((res: any) => {});
    window.location.reload();
  }
}
