import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, routes } from 'src/app/core/core.index';
import {
  apiResultFormat,
  cities,
  pageSelection,
} from 'src/app/core/models/models';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent {
  public routes = routes;
  public services: Array<any> = [];
  public categories: Array<any> = [];
  // pagination variables
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  dataSource!: MatTableDataSource<cities>;
  public searchDataValue = '';
  //** / pagination variables
  newService: any = {};
  serviceToEdit: any = {};
  serviceToDelete: any = {};
  unfilteredData: any = [];

  constructor(
    private data: DataService,
    private pagination: PaginationService,
    private router: Router,
  ) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.additionalServices) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
    this.loadCategories();
  }

  loadCategories(){
    this.data.getCategory().subscribe((apiRes: apiResultFormat) => {
      this.categories = apiRes.data;
    });
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getServices().subscribe((apiRes: apiResultFormat) => {
      this.services = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: cities, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.services.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<cities>(this.services);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.services,
        serialNumberArray: this.serialNumberArray,
        tableData2: [],
      });
      this.unfilteredData = structuredClone(apiRes.data);
    });
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.services = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.services.slice();

    if (!sort.active || sort.direction === '') {
      this.services = data;
    } else {
      this.services = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  addService(){
    this.data.addService(this.newService).subscribe((res: any) => {
      this.newService = {};
      this.getTableData({ skip: 0, limit: 10 });
    });
  }

  setServiceToEdit(service: any) {
    this.serviceToEdit = service;
  }

  updateService(){
    this.data.updateService(this.serviceToEdit).subscribe((res: any) => {
      this.serviceToEdit = {};
      this.getTableData({ skip: 0, limit: 10 });
    });
  }

  setServiceToDelete(service: any) {
    this.serviceToDelete = service;
  }
  deleteService() {
    this.data.deleteService(this.serviceToDelete.additional_service_id).subscribe((res: any) => {
      this.serviceToDelete = {};
      this.getTableData({ skip: 0, limit: 10 });
    });
  }

  queryString: string = '';
  async searchCustomers(){
    this.services = structuredClone(this.unfilteredData);
    this.services = this.services.filter((service) => {
      return (
        service.price?.toString().toLowerCase().includes(this.queryString.toLowerCase()) ||
        service.additional_service_name?.toLowerCase().includes(this.queryString.toLowerCase()) ||
        service.category?.toLowerCase().includes(this.queryString.toLowerCase()) ||
        service.description?.toString().toLowerCase().includes(this.queryString.toLowerCase())
        // purchase.code?.toLowerCase().includes(this.queryString.toLowerCase()) ||
      );
    });
  }

}
