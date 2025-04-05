import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, routes } from 'src/app/core/core.index';
import {
  apiResultFormat,
  pageSelection,
  user,
} from 'src/app/core/models/models';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  public routes = routes;
  Action = 'status';
  status = 'action';
  public users: Array<any> = [];
  public Toggledata = false;
  // pagination variables
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  dataSource!: MatTableDataSource<user>;
  public searchDataValue = '';
  userToAdd: any = {
    role: '',
    status: 'inactive',
  };
  userToEdit: any = {};
  userToDelete: number = 0;
  //** / pagination variables
  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.users) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getUsers().subscribe((apiRes: apiResultFormat) => {
      this.users = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.users.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<user>(this.users);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.users,
        serialNumberArray: this.serialNumberArray,
        tableData2: [],
      });
    });
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.users = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.users.slice();

    if (!sort.active || sort.direction === '') {
      this.users = data;
    } else {
      this.users = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  isCollapsed1 = false;

  users1 = [
    { name: 'Barbara Moore', checked: false },
    { name: 'Hendry Evan', checked: false },
    { name: 'Richard Miles', checked: false },
  ];

  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }

  public toggleData = false;
  openContent() {
    this.toggleData = !this.toggleData;
  }

  addUser() {
    this.data.addUser(this.userToAdd).subscribe((res: any) => {

      this.getTableData({ skip: 0, limit: 10 });
      this.userToAdd = {};

      this.userToAdd = {
        role: '',
        status: 'inactive',
      };
    })
  }

  setUserToEdit(user: user) {
    this.userToEdit = user;
  }

  updateUser() {
    this.data.updateUser(this.userToEdit).subscribe((res: any) => {
      this.getTableData({ skip: 0, limit: 10 });
      this.userToEdit = {};
    })
  }

  setUserToDelete(user: user) {
    this.userToDelete = user.id;
  }

  deleteUser() {
    this.data.deleteUser(this.userToDelete).subscribe((res: any) => {
      this.getTableData({ skip: 0, limit: 10 });
      this.userToDelete = 0;
    })
  }

  changeStatus(user: user) {
    let status = user.status == 'active' ? 'inactive' : 'active';
    this.data.updateUserStatus(user.id, status).subscribe((res: any) => {
      this.getTableData({ skip: 0, limit: 10 });
    })
  }
}
