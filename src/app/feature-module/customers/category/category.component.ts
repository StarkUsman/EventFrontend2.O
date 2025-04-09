import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
import { DataService, routes } from 'src/app/core/core.index';
import { apiResultFormat, category, pageSelection } from 'src/app/core/models/models';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  control = new FormControl();
  public routes = routes;
  public category: Array<category> = [];
  isCollapsed = false;
  parent = 'none';
  parent2 = 'none';
 
  public Toggledata  = false;
    // pagination variables
    public pageSize = 10;
    public serialNumberArray: Array<number> = [];
    public totalData = 0;
    dataSource!: MatTableDataSource<category>;
    public searchDataValue = '';
    //** / pagination variables
    categoryToDelete: number = 0;
    categoryToEdit: any = {};
    newCategory: any = {};
    filteredOptions!: Observable<string[]>;
    categories: any = [];
  

  constructor(private data: DataService,private pagination: PaginationService , private router: Router) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.vendorCategory) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
  }

  allSubCategories: any = []
  subCategoriesSelected: any = []
  ngOnInit(): void {
    
    this.data.getAccountsSubCategory().subscribe((res: any) => {
      this.allSubCategories = res.data;
      for (let i = 0; i < res.data.length; i++) {
        this.categories.push(res.data[i].subcategory);
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
  
  private getTableData(pageOption: pageSelection): void {
    this.data.getAccountsCategory().subscribe((apiRes: apiResultFormat) => {
      this.category = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: category, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.category.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<category>(this.category);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.category,
        serialNumberArray: this.serialNumberArray,
        tableData2: []
      });
    });
  }

  addSubCategory(subcategory: any) {
    let subcategoryToPush = this.allSubCategories.find((item: any) => item.subcategory === subcategory);
    this.subCategoriesSelected.push(subcategoryToPush);

    this.categories = this.categories.filter((item: any) => item!== subcategory);
    setTimeout(() => {
      this.control.setValue('');
    });
  }
  
  removeSubCategory(subCategory: any) {
    this.subCategoriesSelected = this.subCategoriesSelected.filter((item: any) => item!== subCategory);
    this.categories.push(subCategory.subcategory);
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  public sortData(sort: Sort) {
    const data = this.category.slice();

    if (!sort.active || sort.direction === '') {
      this.category = data;
    } else {
      this.category = data.sort((a, b) => {         
        const aValue = (a as never)[sort.active];         
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  isCollapsed1 = false;

  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  public toggleData  = false;
  openContent() {
    this.toggleData = !this.toggleData;
  }
  
  setCategoryToEdit(id: number) {
    this.categoryToEdit = this.category.find((category) => category.id === id);
    this.loadSubCategories();
  }

  loadSubCategories() {
    this.subCategoriesSelected = [];
    this.categories = [];
    this.data.getAccountsSubCategory().subscribe((res: any) => {
      this.allSubCategories = res.data;
      this.subCategoriesSelected = this.categoryToEdit.subcategory;

      const selectedSubCategoryNames = this.subCategoriesSelected.map((item: any) => item.subcategory);

      const filteredSubCategories = this.allSubCategories.filter(
        (item: any) => !selectedSubCategoryNames.includes(item.subcategory)
      );

      for (let i = 0; i < filteredSubCategories.length; i++) {
        this.categories.push(filteredSubCategories[i].subcategory);
      }
      this.filteredOptions = this.control.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      )
    });
  }

  updateCategory() {
    this.categoryToEdit.subcategory = this.subCategoriesSelected;
    this.data.updateaCategory(this.categoryToEdit).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.categoryToEdit = {};
    });
  }

  addCategory() {
    this.newCategory.subcategory = this.subCategoriesSelected;
    this.data.addaCategory(this.newCategory).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.newCategory = {};
    });
  }

  setCategoryToDelete(id: number) {
    this.categoryToDelete = id;
  }

  deleteCategory(id: number) {
    this.data.deleteaCategory(id).subscribe((res) => {
      this.getTableData({ skip: 0, limit: this.pageSize });
      this.categoryToDelete = 0;
    });
  }
}
