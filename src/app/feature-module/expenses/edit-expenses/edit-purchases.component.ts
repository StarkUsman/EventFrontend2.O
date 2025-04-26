import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService, routes } from 'src/app/core/core.index';
import {
  apiResultFormat,
  editcreditnotes,
  pageSelection,
} from 'src/app/core/models/models';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-edit-purchases',
  templateUrl: './edit-purchases.component.html',
  styleUrls: ['./edit-purchases.component.scss'],
})
export class EditPurchasesComponent implements OnInit {
  control = new FormControl();
  purchaseDateValue: Date = new Date();
  dueDateValue: Date = new Date();
  selectbank = 'Bank1';
  myDateValue!: Date;
  public minDate!: Date;
  public maxDate!: Date;
  public routes = routes;
  country = 'India';
  products = 'products';
  bank = 'bank';
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
  vendor: any = {};
  allProducts: any = [];
  purchaseToEdit: any = {};
  selectedProduct: any = {};
  selectedProducts: any = [];
  oldPurchaseRef: any = {};
  selectedProductEdit: any = {};
  total_purch_amount: any = 0;
  product_to_remove: any = {};
  filteredOptions!: Observable<string[]>;
  productNames: any = [];

  constructor(private route: ActivatedRoute, private data: DataService) {}

  ngOnInit(): void {
    this.getTableData();
    this.data.getVendorByName("FOOD EXPENSE").subscribe((res: any) => {
      this.vendor = res;
    });
    this.data.getProductlist().subscribe((res) => {
      this.allProducts = res.data;
    });
    this.route.queryParams.subscribe(params => {
      let id = params['id'];
      this.data.getExpenseByID(id).subscribe((res: any) => {
        this.purchaseToEdit = res;
        this.purchaseDateValue = new Date(this.purchaseToEdit.purchase_date);
        this.selectedProducts = this.purchaseToEdit.products;
        this.oldPurchaseRef = JSON.parse(JSON.stringify(res));
        this.total_purch_amount = this.calculateTotalAmount();
        this.allProducts = this.allProducts.filter((p: any) => {
          let found = this.selectedProducts.find((sp: any) => sp.id === p.id);
          return !found;
        });

        if (this.purchaseToEdit?.signature_img) {
          const file = this.base64ToFile(
            this.purchaseToEdit.signature_img,
            'signature.png'
          );
          this.files.push(file);
        }

        this.data.getProductlist().subscribe((res: any) => {
          for (let i = 0; i < res.data.length; i++) {
            this.productNames.push(res.data[i].item);
          }
          this.productNames = this.productNames.filter((name: any) => {
            // Filter out the names that are not in the selected products
            return !this.selectedProducts.some((product: any) => product.item === name);
          });
    
          this.filteredOptions = this.control.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
          );
        });

      });
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.productNames.filter((option: any) => option.toLowerCase().includes(filterValue));
  }

  base64ToFile(data: any, filename: string) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
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
      this.purchaseToEdit.signature_img = reader.result;
    };
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  // onProductSelect(product: any) {
  //   if (product) {
  //     product.quantity = 1;
  //     let price = parseFloat(product.purchasePrice);
  //     product.amount = price * product.quantity;
  //     this.selectedProducts.push(product);

  //     this.allProducts = this.allProducts.filter((p: any) => p.id !== product.id);

  //     this.selectedProduct = null;
  //   }
  // }

  onProductSelect(productName: any) {
    const product = this.allProducts.find((p: any) => p.item === productName);
    if (product) {
      product.quantity = 1;
      let price = parseFloat(product.purchasePrice);
      product.amount = price * product.quantity;
      this.selectedProducts.push(product);

      this.allProducts = this.allProducts.filter((p: any) => p.id !== product.id);
      this.productNames = this.productNames.filter((p: any) => p !== productName);

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

  setEditProduct(product: any) {
    product.price = parseFloat(product.purchasePrice);
    product.discount = 0;
    product.tax = "0";
    this.selectedProductEdit = product;
  }

  updateProduct() {
    this.selectedProductEdit.purchasePrice = this.selectedProductEdit.price;
    this.selectedProductEdit.amount = (this.selectedProductEdit.price * this.selectedProductEdit.quantity) - this.selectedProductEdit.discount;
    this.selectedProductEdit.amount = this.selectedProductEdit.amount + (this.selectedProductEdit.amount * (parseFloat(this.selectedProductEdit.tax) / 100));
    this.selectedProducts = this.selectedProducts.map((p: any) => {
      if (p.id === this.selectedProductEdit.id) {
        p = this.selectedProductEdit;
      }
      return p;
    });
  }

  calculateTotalAmount() {
    let total = 0;
    this.selectedProducts.forEach((p: any) => {
      total += p.amount;
    });
    return total;
  }

  updateLedger() {
    this.data.getLedgerByEVID(this.vendor.vendor_id, this.purchaseToEdit.purch_id).subscribe((res: any) => {
      let ledger = res.ledger[0];
      let ledgerToUpdate = {
        id: ledger.id,
        name: ledger.name,
        purch_id: this.purchaseToEdit.purch_id,
        vendor_id: ledger.vendor_id,
        amountDebit: 0,
        amountCredit: this.purchaseToEdit.total_amount,
      };
      this.data.updateLedgerById(ledgerToUpdate).subscribe((res: any) => {});
    });

  }

  updateInventoryLedger(purchase: any, product: any) {
    this.data.getInventoryLedgerByEPID(product.id, purchase.purch_id).subscribe((res: any) => {
      let ledger = res.ledger[0];
      let ledgerToUpdate = {
        id: ledger.id,
        name: ledger.name,
        purchasePrice: product.purchasePrice,
        user: JSON.parse(localStorage.getItem('user') || '{}'),
        voucher: this.purchaseToEdit.purch_id,
        product_id: product.id,
        stockIn: 0,
        stockOut: product.quantity,
      };

      this.data.updateInventoryLedgerByID(ledgerToUpdate).subscribe((res: any) => {});
    });
  }

  editPurchase() {
    this.purchaseToEdit.purch_id = parseInt(this.purchaseToEdit.purch_id);
    this.selectedProducts = this.selectedProducts.map((p: any) => {
      delete p.img;
      delete p.sNo;
      return p;
    });

    this.purchaseToEdit.products = this.selectedProducts;
    this.purchaseToEdit.total_amount = this.calculateTotalAmount();
    this.purchaseToEdit.status = "Pending";
    this.purchaseToEdit.paymentmode = "cash";
    
    this.updateLedger();

    this.purchaseToEdit.products.forEach((p: any) => {
      this.updateInventoryLedger(this.purchaseToEdit, p);
    });

    this.data.editExpense(this.purchaseToEdit).subscribe((res) => {
    });
  }
}
