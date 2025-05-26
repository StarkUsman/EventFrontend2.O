import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, routes } from 'src/app/core/core.index';
import {
  apiResultFormat,
  editcreditnotes,
  pageSelection,
} from 'src/app/core/models/models';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-purchases',
  templateUrl: './add-purchases.component.html',
  styleUrls: ['./add-purchases.component.scss'],
})
export class AddPurchasesComponent implements OnInit {
  control = new FormControl();
  myDateValue!: Date;
  purchaseDateValue: Date = new Date();
  dueDateValue: Date = new Date();
  public minDate!: Date;
  public maxDate!: Date;
  public routes = routes;
  country = 'India';
  selectbank = 'Bank1';
  discount = 'discount1';
  tax = 'Tax';
  public editcreditnotes: Array<editcreditnotes> = [];
  public Toggledata = false;
  dataSource!: MatTableDataSource<editcreditnotes>;
  public searchDataValue = '';
  // pagination variables
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  //** / pagination variables
  allVendors: any = [];
  allProducts: any = [];
  newPurchase: any = {};
  selectedProduct: any = {};
  selectedProducts: any = [];
  selectedProductEdit: any = {};
  total_purch_amount: any = 0;
  product_to_remove: any = {};
  filteredOptions!: Observable<string[]>;
  products: any = [];
  newProduct: any = {};
  categories: any = [];
  units: any = [];

  constructor(private router: Router, private data: DataService) {
    this.newPurchase.purchase_date = this.purchaseDateValue;
    this.dueDateValue.setMonth(this.purchaseDateValue.getMonth() + 1);
    this.newPurchase.due_date = this.dueDateValue;

  }

  ngOnInit(): void {
    this.getTableData();
    this.data.getVendorsOnly().subscribe((res) => {
      this.allVendors = res.data;
    });
    this.data.getCategory().subscribe((res) => {
      this.categories = res.data;
    });
    this.data.getUnits().subscribe((res) => {
      this.units = res.data;
    });

    this.data.getProductlist().subscribe((res) => {
      this.allProducts = res.data;
      for (let i = 0; i < res.data.length; i++) {
        this.products.push(res.data[i].item);
      }

      this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      );
    });

    this.data.getpurchase().subscribe((res) => {
      // set newPurchase.purch_id to last purch_id + 1 and make it 6 digit
      let purch_id = res.data[res.data.length-1] ? res.data[res.data.length-1].purch_id : 100;
      purch_id = parseInt(purch_id) + 1;
      purch_id = purch_id.toString();
      while (purch_id.length < 6) {
        purch_id = "0" + purch_id;
      }
      this.newPurchase.purch_id = purch_id;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.products.filter((option: any) => option.toLowerCase().includes(filterValue));
  }

  private getTableData(): void {
    this.editcreditnotes = [];
    this.serialNumberArray = [];

    this.data.getEditcreditnotes().subscribe((data: apiResultFormat) => {
      this.totalData = data.totalData;
      data.data.map((res: editcreditnotes, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          res.editcreditnotes = serialNumber;
          this.editcreditnotes.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<editcreditnotes>(
        this.editcreditnotes,
      );
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  public sortData(sort: Sort) {
    const data = this.editcreditnotes.slice();

    if (!sort.active || sort.direction === '') {
      this.editcreditnotes = data;
    } else {
      this.editcreditnotes = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    }
  }
  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableData();
  }
  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }
  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
  open() {
    this.Toggledata = !this.Toggledata;
  }
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  files: File[] = [];
  onSelect(event: { addedFiles: File[] }) {
    const file = event.addedFiles[0];
    this.files.push(...event.addedFiles);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.newPurchase.signature_img = reader.result;
    };
  }
  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  initNewProduct(){
    this.data.getProductlist().subscribe((res) => {
      this.newProduct.code = res.data[res.data.length-1]?.code ? parseFloat(res.data[res.data.length-1].code) + 1 : 101;
      this.newProduct.code = String(this.newProduct.code).padStart(6, '0');
    });
  }

  addProduct() {
    this.data.addProduct(this.newProduct).subscribe((res: any) => {
      res.purchasePrice = res.purchasePrice.toFixed(2),
      this.newProduct = {};
      this.products.push(res.item);
      this.allProducts.push(res);
      this.filteredOptions = this.control.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
        );
    });
  }

  onProductSelect(productName: any) {
    const product = this.allProducts.find((p: any) => p.item === productName);
    if (product) {
      product.quantity = 1;
      let price = parseFloat(product.purchasePrice);
      product.amount = price * product.quantity;
      this.selectedProducts.push(product);

      this.allProducts = this.allProducts.filter((p: any) => p.id !== product.id);
      this.products = this.products.filter((p: any) => p !== productName);

      this.selectedProduct = null;
      setTimeout(() => {
        this.control.setValue('');
      });
    }
  }

  setDeleteProduct(product: any) {
    this.product_to_remove = product;
  }

  deleteProduct() {
    this.selectedProducts = this.selectedProducts.filter((p: any) => p.id !== this.product_to_remove.id);
    this.allProducts.push(this.product_to_remove);
  }

  editedProduct: any = null;
  editedProductCopy: any = null;

  setEditProduct(product: any) {
    this.editedProductCopy = JSON.parse(JSON.stringify(product)); // deep clone
    this.editedProduct = {
      ...product,
      price: parseFloat(product.purchasePrice),
      discount: product.discount || 0,
      tax: product.tax || "0"
    };
  }

  saveProductEdit() {
    this.editedProduct.purchasePrice = this.editedProduct.price;
    let amt = (this.editedProduct.price * this.editedProduct.quantity) - this.editedProduct.discount;
    this.editedProduct.amount = amt + (amt * (parseFloat(this.editedProduct.tax) / 100));

    this.selectedProducts = this.selectedProducts.map((p: any) =>
      p.id === this.editedProduct.id ? { ...this.editedProduct } : p
    );

    this.data.updateProductPrice(this.editedProduct).subscribe((res: any) => {
      // optional: toast or confirmation
    });

    this.editedProduct = null;
    this.editedProductCopy = null;
  }

  cancelProductEdit() {
    this.selectedProducts = this.selectedProducts.map((p: any) =>
      p.id === this.editedProductCopy.id ? { ...this.editedProductCopy } : p
    );

    this.editedProduct = null;
    this.editedProductCopy = null;
  }

  calculateTotalAmount() {
    let total = 0;
    this.selectedProducts.forEach((p: any) => {
      total += p.amount;
    });
    return total;
  }

  // ledger function
  addLedger(purch_id: any, vendor_id: any, amountDebit: any) {
    let ledger = {
      name: "SRV", //Stock Received Voucher
      purch_id: purch_id,
      vendor_id: vendor_id,
      amountDebit: amountDebit,
      amountCredit: 0
    };

    this.data.addLedger(ledger).subscribe((res) => { });
  }

  addInventoryLedger(newPurchase: any, product: any) {

    let inventoryLedger = {
      name: "SIV", //Stock In Voucher
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      purchasePrice: parseFloat(product.purchasePrice),
      voucher: newPurchase.purch_id,
      product_id: product.id,
      stockOut: 0,
      stockIn: product.quantity
    }
    this.data.addInventoryLedger(inventoryLedger).subscribe((res) => { });
  }


  addPurchase() {
    this.newPurchase.purch_id = parseInt(this.newPurchase.purch_id);
    // remove img from products
    this.selectedProducts = this.selectedProducts.map((p: any) => {
      delete p.img;
      delete p.sNo;
      return p;
    });

    this.newPurchase.products = this.selectedProducts;
    this.newPurchase.total_amount = this.calculateTotalAmount();
    this.newPurchase.status = "Pending";
    this.newPurchase.paymentmode = "cash";
    // make api call for each product selectedProducts
    // this.selectedProducts.forEach((p: any) => {
    //   this.data.addPurchaseProduct(p).subscribe((res) => {
    //   });
    // });

    this.addLedger(this.newPurchase.purch_id, this.newPurchase.vendor.id, this.newPurchase.total_amount);
    
    this.newPurchase.products.forEach((p: any) => {
      this.addInventoryLedger(this.newPurchase, p);
    });

    this.data.addPurchase(this.newPurchase).subscribe((res:any) => {
      this.router.navigate([routes.purchasesdetails], {
            queryParams: { id: res.id }
          });
    });
  }
}
