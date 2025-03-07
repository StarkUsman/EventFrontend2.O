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
import { S } from '@angular/cdk/keycodes';
import { co } from '@fullcalendar/core/internal-common';

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
  allVendors: any = [];
  allProducts: any = [];
  purchaseToEdit: any = {};
  selectedProduct: any = {};
  selectedProducts: any = [];
  oldPurchaseRef: any = {};
  selectedProductEdit: any = {};
  total_purch_amount: any = 0;
  product_to_remove: any = {};
  ledgerToUpdate: any = {};

  constructor(private route: ActivatedRoute, private data: DataService) {}

  ngOnInit(): void {
    this.getTableData();
    this.data.getVendors().subscribe((res) => {
      this.allVendors = res.data;
    });
    this.data.getProductlist().subscribe((res) => {
      this.allProducts = res.data;
    });
    this.route.queryParams.subscribe(params => {
      let id = params['id'];
      this.data.getPurchaseById(id).subscribe((res: any) => {
        this.purchaseToEdit = res;
        this.purchaseDateValue = new Date(this.purchaseToEdit.purchase_date);
        this.dueDateValue = new Date(this.purchaseToEdit.due_date);
        this.purchaseToEdit.vendor = this.allVendors.find((v: any) => v.id === this.purchaseToEdit.vendor.id);
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

      });
    });
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

  onProductSelect(product: any) {
    if (product) {
      product.quantity = 1;
      let price = product.purchasePrice.replace(/[^0-9.]/g, '');
      price = parseFloat(price);
      product.amount = price * product.quantity;
      this.selectedProducts.push(product);

      this.allProducts = this.allProducts.filter((p: any) => p.id !== product.id);

      this.selectedProduct = null;
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
    product.price = parseFloat(product.purchasePrice.replace(/[^0-9.]/g, ''));
    product.discount = 0;
    product.tax = "0";
    this.selectedProductEdit = product;
  }

  updateProduct() {
    this.selectedProductEdit.purchasePrice = "$" + this.selectedProductEdit.price;
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

  updateLedger(purch_id: any, amountDebit: any) {
    this.data.getLedgerByVID(this.purchaseToEdit.vendor.id).subscribe((res: any) => {
      let ledgers = res.data;
      // filter out the ledger with the same purch_id
      let ledger = ledgers.find((l: any) => l.purch_id === purch_id);
      if (ledger) {
        this.ledgerToUpdate = ledger;
        this.ledgerToUpdate.name = "ER";
        this.ledgerToUpdate.amountDebit = amountDebit;
        this.data.updateLedgerById(this.ledgerToUpdate).subscribe((res) => { });
      }
    });

  }

  editPurchase() {
    this.purchaseToEdit.purch_id = parseInt(this.purchaseToEdit.purch_id);
    // remove img from products
    this.selectedProducts = this.selectedProducts.map((p: any) => {
      delete p.img;
      delete p.sNo;
      return p;
    });

    this.purchaseToEdit.products = this.selectedProducts;
    this.purchaseToEdit.total_amount = this.calculateTotalAmount();
    this.purchaseToEdit.status = "Pending";
    this.purchaseToEdit.paymentmode = "cash";

    this.oldPurchaseRef.products.forEach((p: any) => {
      this.data.removePurchaseProduct(p).subscribe((res) => {
      });
    });
    
    this.selectedProducts.forEach((p: any) => {
      this.data.addPurchaseProduct(p).subscribe((res) => {
      });
    });
    
    this.updateLedger(this.oldPurchaseRef.purch_id, this.oldPurchaseRef.total_amount);
    this.updateLedger(this.purchaseToEdit.purch_id, this.purchaseToEdit.total_amount)

    this.data.editPurchase(this.purchaseToEdit).subscribe((res) => {
    });
  }
}
