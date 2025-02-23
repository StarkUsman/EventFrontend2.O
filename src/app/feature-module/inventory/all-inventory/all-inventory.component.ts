import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { routes, DataService } from 'src/app/core/core.index';
import { inventory, pageSelection, apiResultFormat } from 'src/app/core/models/models';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';

@Component({
  selector: 'app-all-inventory',
  templateUrl: './all-inventory.component.html',
  styleUrls: ['./all-inventory.component.scss']
})
export class AllInventoryComponent {
  stock = "pieces"
  stock1 = "pieces"
  public routes = routes;
  public tableData: Array<inventory> = [];
  public Toggledata  = false;
  public searchDataValue = '';
 // pagination variables
 public pageSize = 10;
 public serialNumberArray: Array<number> = [];
 public totalData = 0;
 dataSource!: MatTableDataSource<inventory>;
 // pagination variables end
 inventoryUpdated: any = {};
 inventoryToDelete: any = {};
 bootstrap: any;

  constructor(private data: DataService, private pagination: PaginationService,
    private router: Router) {
      this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
        if (this.router.url == this.routes.allInventory) {
          this.getTableData({ skip: res.skip, limit: res.limit });
          this.pageSize = res.pageSize;
        }
      });
    }
    private getTableData(pageOption: pageSelection): void {
      this.data.getinventory().subscribe((apiRes: apiResultFormat) => {
        this.tableData = [];
        this.serialNumberArray = [];
        this.totalData = apiRes.totalData;
        apiRes.data.map((res: inventory, index: number) => {
          const serialNumber = index + 1;
          if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
            res.sNo = serialNumber;
            this.tableData.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
        this.dataSource = new MatTableDataSource<inventory>(this.tableData);
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

  isCollapsed1 = false;
  isCollapsed2 = false;
  users = [
    { name: 'Lobar Handy', checked: false },
    { name: 'Woodcraft Sandal', checked: false }
  ];
  usersTwo = [
    { name: 'P125392', checked: false },
    { name: 'P125393', checked: false },
    { name: 'P125394', checked: false }
  ];
  
  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }
  public toggleData  = false;
  openContent() {
    this.toggleData = !this.toggleData;
  }

  setinventory(inventory: inventory) {
    this.inventoryUpdated = inventory;
  }

  addStock() {
    this.inventoryUpdated.quantity = (parseFloat(this.inventoryUpdated.quantity) + parseFloat(this.inventoryUpdated.quantityAdded)).toString();
    //delete unit from inventoryUpdated
    delete this.inventoryUpdated.units;
    this.data.updateinventory(this.inventoryUpdated).subscribe((res: any) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
    } );
  }

  removeStock() {
    this.inventoryUpdated.quantity = (parseFloat(this.inventoryUpdated.quantity) - parseFloat(this.inventoryUpdated.quantityRemoved)) < 0 ? '0' : (parseFloat(this.inventoryUpdated.quantity) - parseFloat(this.inventoryUpdated.quantityRemoved)).toString();
    //delete unit from inventoryUpdated
    delete this.inventoryUpdated.units;
    this.data.updateinventory(this.inventoryUpdated).subscribe((res: any) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
    } );
  }

  setinventoryToDelete(inventory: any) {
    console.log("====================================");
    console.log(inventory);
    console.log("====================================");
    this.inventoryToDelete = inventory.id;
    this.data.deleteinventory(this.inventoryToDelete).subscribe((res: any) => {});
    
    this.tableData = this.tableData.filter((res: any) => res.id !== this.inventoryToDelete);
  }
}
