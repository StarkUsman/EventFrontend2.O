 
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { routes } from '../../core.index';
import { SideBar, SideBarData, SideBarMenu, apiResultFormat, vendor } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  backendUrl: string;
  constructor(private http: HttpClient) {
    this.backendUrl = (window as any)['env'].backendUrl;
    console.log('Using backend URL:', this.backendUrl);
    // this.loadConfig();
  }

  // private loadConfig(): void {
  //   this.http.get<any>('assets/env.json').subscribe(config => {
  //     this.backendUrl = config.backendUrl;
  //     console.log('Backend URL loaded:', this.backendUrl);
  //   });
  // }

  public getEvents() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/bookings/all').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getCustomers() {
    return this.http.get<apiResultFormat>('assets/JSON/customers.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getActive() {
    return this.http
      .get<apiResultFormat>('assets/JSON/activecustomer.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getDeactive() {
    return this.http
      .get<apiResultFormat>('assets/JSON/deactivecustomer.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }

  public getBlogs() {
    return this.http.get<apiResultFormat>('assets/JSON/blogs.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getCategories() {
    return this.http.get<apiResultFormat>('assets/JSON/categories.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getSalesReport() {
    return this.http.get<apiResultFormat>('assets/JSON/salesReport.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getstockReport() {
    return this.http.get<apiResultFormat>('assets/JSON/stock-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getincomeReport() {
    return this.http
      .get<apiResultFormat>('assets/JSON/income-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTaxReport() {
    return this.http.get<apiResultFormat>('assets/JSON/tax.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getExpensesList() {
    return this.http.get<apiResultFormat>('assets/JSON/expenses.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPaymentList() {
    return this.http.get<apiResultFormat>('assets/JSON/payments.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getInvoiceItem() {
    return this.http.get<apiResultFormat>('assets/JSON/itemList.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getEstimatesList() {
    return this.http.get<apiResultFormat>('assets/JSON/estimates.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getTicketList() {
    return this.http.get<apiResultFormat>('assets/JSON/ticket.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTicketopenList() {
    return this.http.get<apiResultFormat>('assets/JSON/ticket.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTicketPending() {
    return this.http
      .get<apiResultFormat>('assets/JSON/ticketsPending.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTicketOpen() {
    return this.http.get<apiResultFormat>('assets/JSON/ticketsopen.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTicketresolved() {
    return this.http
      .get<apiResultFormat>('assets/JSON/ticketsresolved.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTicketOverdue() {
    return this.http
      .get<apiResultFormat>('assets/JSON/ticketsOverdue.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTicketclosed() {
    return this.http.get<apiResultFormat>('assets/JSON/ticketclosed.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTicketCancelled() {
    return this.http
      .get<apiResultFormat>('assets/JSON/ticketCancelled.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTicketRecurring() {
    return this.http
      .get<apiResultFormat>('assets/JSON/ticketrecurring.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCountries() {
    return this.http.get<apiResultFormat>('assets/JSON/countries.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getbankaccount() {
    return this.http.get<apiResultFormat>('assets/JSON/bankaccount.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getServices() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/additional-services/formatted').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getServicesUF(){
    return this.http.get(this.backendUrl+'/additional-services');
  }

  public getHalls(){
    return this.http.get(this.backendUrl+'/halls');
  }

  public getBookingEvents(){
    return this.http.get(this.backendUrl+'/events');
  }

  public addService(service: any){
    return this.http.post(this.backendUrl+'/additional-services', service);
  }

  public updateService(service: any){
    return this.http.put(this.backendUrl+`/additional-services/${service.additional_service_id}`, service);
  }

  public deleteService(id: number){
    return this.http.delete(this.backendUrl+`/additional-services/${id}`);
  }

  public getCities() {
    return this.http.get<apiResultFormat>('assets/JSON/city.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getDeliverychallan() {
    return this.http
      .get<apiResultFormat>('assets/JSON/deliverychallens.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getMessages() {
    return this.http.get<apiResultFormat>('assets/JSON/message.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getFaq() {
    return this.http.get<apiResultFormat>('assets/JSON/faq.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTestimonials() {
    return this.http.get<apiResultFormat>('assets/JSON/testimonials.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  // public addVoucher(voucher: any) {
  //   return this.http.post(this.backendUrl+'/vouchers', voucher);
  // }

  public login(username: string, password: string) {
    return this.http.post(this.backendUrl+'/users/login', { username, password });
  }

  public getMenus() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/menus').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  
  public addMenu(menu: any) {
    return this.http.post(this.backendUrl+'/menus', menu);
  }
  
  public deleteMenu(id: number) {
    return this.http.delete(this.backendUrl+`/menus/${id}`);
  }
  
  public updateMenu(menu: any) {
    return this.http.put(this.backendUrl+`/menus/${menu.menu_id}`, menu);
  }
  
  public getMenuItems() {
    return this.http.get(this.backendUrl+`/menu-items`);
  }

  public getAllMenuItems() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/menu-items/formatted').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public updateMenuItem(menuItem: any) {
    return this.http.put(this.backendUrl+`/menu-items/${menuItem.menu_item_id}`, menuItem);
  }
  
  public getMenuItemByID(id: any){
    return this.http.get(this.backendUrl+`/menu-items/${id}`);
  }

  public addMenuItem(menuItem: any) {
    return this.http.post(this.backendUrl+'/menu-items', menuItem);
  }

  public deleteMenuItem(menuItem: any) {
    return this.http.delete(this.backendUrl+`/menu-items/${menuItem.menu_item_id}`);
  }
  
  public getReservationsUF() {
    return this.http.get(this.backendUrl+'/bookings');
  }
  

  public getReservations() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/bookings/formatted').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getReservationById(id: number) {
    return this.http.get(this.backendUrl+`/bookings/${id}`);
  }

  public addReservation(reservation: any) {
    return this.http.post(this.backendUrl+'/bookings', reservation);
  }

  public updateReservation(reservation: any) {
    return this.http.put(this.backendUrl+`/bookings/${reservation.booking_id}`, reservation);
  }

  public addReservationPayment(body: any) {
    return this.http.put(this.backendUrl+`/bookings/payment/${body.id}`, body);
  }

  public deleteReservation(id: number) {
    return this.http.delete(this.backendUrl+`/bookings/${id}`);
  }


  public getCompanySettings() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/settings').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public saveCompanySettings(settings: any) {
    return this.http.post(this.backendUrl+'/settings', settings);
  }

  public updateCompanySettings(settings: any) {
    return this.http.put(this.backendUrl+`/settings/${settings.id}`, settings);
  }

  public getVendors() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/vendors').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getVendorsOnly() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/vendors/category').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getAssetAccounts() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/vendors/assets').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getVouchers() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/vouchers').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public deleteVoucher(sNo: number) {
    return this.http.delete(this.backendUrl+`/vouchers/${sNo}`);
  }

  public addVoucher(voucher: any) {
    return this.http.post(this.backendUrl+'/vouchers', voucher);
  }

  public updateVoucher(voucher: any) {
    return this.http.put(this.backendUrl+`/vouchers/${voucher.id}`, voucher);
  }

  public getSalary() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/salary').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getAllCalculatedSalaries() {
    return this.http.get(this.backendUrl+`/salary/calculate`);
  }

  public addSalary(salary: any) {
    return this.http.post(this.backendUrl+'/salary', salary);
  }
  
  public updateSalary(salary: any) {
    return this.http.put(this.backendUrl+`/salary/${salary.id}`, salary);
  }

  public deleteSalary(id: number) {
    return this.http.delete(this.backendUrl+`/salary/${id}`);
  }

  public getAccountsCategory() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/acategory').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getExpenseAccountCategory() {
    return this.http.get(this.backendUrl+'/acategory/EXPENSE');
  }

  public addaCategory(category: any) {
    return this.http.post(this.backendUrl+'/acategory', category);
  }

  public updateaCategory(category: any) {
    return this.http.put(this.backendUrl+`/acategory/${category.id}`, category);
  }

  public deleteaCategory(id: number) {
    return this.http.delete(this.backendUrl+`/acategory/${id}`);
  }

  public getAccountsSubCategory() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/asubcategory').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public addaSubCategory(subcategory: any) {
    return this.http.post(this.backendUrl+'/asubcategory', subcategory);
  }

  public updateaSubCategory(subcategory: any) {
    return this.http.put(this.backendUrl+`/asubcategory/${subcategory.id}`, subcategory);
  }

  public deleteaSubCategory(id: number) {
    return this.http.delete(this.backendUrl+`/asubcategory/${id}`);
  }

  public getVendorById(id: number) {
    return this.http.get(this.backendUrl+`/vendors/${id}`);
  }

  public getVendorByName(name: any) {
    return this.http.get(this.backendUrl+`/vendors/name/${name}`);
  }

  public deleteVendor(sNo: number) {
    return this.http.delete(this.backendUrl+`/vendors/${sNo}`);
  }

  public addVendor(vendor: any) {
    return this.http.post(this.backendUrl+'/vendors', vendor);
  }

  public updateVendor(vendor: any) {
    return this.http.put(this.backendUrl+`/vendors/${vendor.id}`, vendor);
  }

  public getLedgerByVID(id: number) {
    return this.http.get(this.backendUrl+`/ledger/${id}`);
  }

  public getLedgerByPID(id: number, purch_id: any) {
    return this.http.get(this.backendUrl+`/ledger/${id}/purch/${purch_id}`);
  }

  public getLedgerByPRID(id: number, purch_id: any) {
    return this.http.get(this.backendUrl+`/ledger/${id}/pret/${purch_id}`);
  }

  public getLedgerByEVID(id: number, purch_id: any) {
    return this.http.get(this.backendUrl+`/ledger/${id}/expense/${purch_id}`);
  }
  
  public getInventoryLedgerByPID(id: number) {
    return this.http.get<apiResultFormat>(this.backendUrl+`/inventoryLedger/${id}`)
    .pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  
  public getInventoryLedgerByPUID(id: number, purch_id: any) {
    return this.http.get(this.backendUrl+`/inventoryLedger/${id}/purch/${purch_id}`);
  }
  
  public getInventoryLedgerByPRUID(id: number, purch_id: any) {
    return this.http.get(this.backendUrl+`/inventoryLedger/${id}/pret/${purch_id}`);
  }

  public getInventoryLedgerByEPID(id: number, purch_id: any) {
    return this.http.get(this.backendUrl+`/inventoryLedger/${id}/expense/${purch_id}`);
  }

  public updateInventoryLedgerByID(ledger: any) {
    return this.http.put(this.backendUrl+`/inventoryLedger/${ledger.id}`, ledger);
  }

  public getCreditedLedger(id: number) {
    return this.http.get(this.backendUrl+`/ledger/credit/${id}`);
  }

  public getDebitiedLedger(id: number) {
    return this.http.get(this.backendUrl+`/ledger/debit/${id}`);
  }

  public getInventoryStockInLedger(id: number) {
    return this.http.get(this.backendUrl+`/inventoryLedger/stockIn/${id}`);
  }

  public getInventoryStockOutLedger(id: number) {
    return this.http.get(this.backendUrl+`/inventoryLedger/stockOut/${id}`);
  }

  public getFilteredLedger(id: number, startDate: string, endDate: string, vendorName: string) {
    return this.http.get(this.backendUrl+`/ledger/${id}?startDate=${startDate}&endDate=${endDate}&vendorName=${vendorName}`);
  
  }
  public getInventoryFilteredLedger(id: number, startDate: string, endDate: string, userName: string) {
    return this.http.get(this.backendUrl+`/inventoryLedger/${id}?startDate=${startDate}&endDate=${endDate}&name=${userName}`);
  }

  public addLedger(ledger: any){
    return this.http.post(this.backendUrl+'/ledger', ledger);
  }

  public addReservationLedger(ledger: any){
    return this.http.post(this.backendUrl+'/bookingledger', ledger);
  }

  public getReservationLedgerById(id: number) {
    return this.http.get(this.backendUrl+`/bookingledger/${id}`);
  }

  public addInventoryLedger(ledger: any){
    return this.http.post(this.backendUrl+'/inventoryLedger', ledger);
  }

  public updateLedgerById(ledger: any){
    return this.http.put(this.backendUrl+`/ledger/${ledger.id}`, ledger);
  }

  public getLedger() {
    return this.http.get<apiResultFormat>('assets/JSON/ledger.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public recurringinvoice() {
    return this.http
      .get<apiResultFormat>('assets/JSON/recurringinvoice.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public recurringPending() {
    return this.http
      .get<apiResultFormat>('assets/JSON/recurringpending.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public recurringOverdue() {
    return this.http
      .get<apiResultFormat>('assets/JSON/recurringoverdue.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public recurring() {
    return this.http.get<apiResultFormat>('assets/JSON/recurring.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public recurringCancelled() {
    return this.http
      .get<apiResultFormat>('assets/JSON/recurringcancelled.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public recurringDraft() {
    return this.http
      .get<apiResultFormat>('assets/JSON/recurringdraft.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getUnits() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/units').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public deleteUnits(sNo: number) {
    return this.http.delete(this.backendUrl+`/units/${sNo}`);
  }

  public addUnits(unit: any) {
    return this.http.post(this.backendUrl+'/units', unit);
  }

  public updateUnits(unit: any) {
    return this.http.put(this.backendUrl+`/units/${unit.unit_id}`, unit);
  }

  public getCategory() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/category').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public deleteCategory(id: number) {
    return this.http.delete(this.backendUrl+`/category/${id}`);
  }

  public addCategory(category: any) {
    return this.http.post(this.backendUrl+'/category', category);
  }

  public updateCategory(category: any) {
    return this.http.put(this.backendUrl+`/category/${category.id}`, category);
  }

  public getProductlist() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/products').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public deleteProduct(id: number) {
    return this.http.delete(this.backendUrl+`/products/${id}`);
  }

  public getProductById(id: number) {
    return this.http.get(this.backendUrl+`/products/${id}`);
  }

  public updateProduct(product: any) {
    return this.http.put(this.backendUrl+`/products/${product.id}`, product);
  }

  public updateProductPrice(product: any) {
    return this.http.put(this.backendUrl+`/products/price/${product.id}`, product);
  }

  public addProduct(product: any) {
    return this.http.post(this.backendUrl+'/products', product);
  }

  public getcreditnotes() {
    return this.http.get<apiResultFormat>('assets/JSON/creditnotes.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getEditcreditnotes() {
    return this.http
      .get<apiResultFormat>('assets/JSON/editcreditnotes.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCreditnotespending() {
    return this.http
      .get<apiResultFormat>('assets/JSON/creditnotespending.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCreditnotesoverdue() {
    return this.http
      .get<apiResultFormat>('assets/JSON/creditnotesoverdue.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCreditnotesdraft() {
    return this.http
      .get<apiResultFormat>('assets/JSON/creditnotesdraft.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCreditnoterecurring() {
    return this.http
      .get<apiResultFormat>('assets/JSON/creditnotesrecurring.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCreditnotecancel() {
    return this.http
      .get<apiResultFormat>('assets/JSON/creditnotescancel.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getinvoice() {
    return this.http.get<apiResultFormat>('assets/JSON/invoice.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getinvoicepaid() {
    return this.http.get<apiResultFormat>('assets/JSON/invoicepaid.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getinvoiceoverdue() {
    return this.http
      .get<apiResultFormat>('assets/JSON/invoiceoverdue.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public quotationReport() {
    return this.http
      .get<apiResultFormat>('assets/JSON/quotation-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public paymentReport() {
    return this.http
      .get<apiResultFormat>('assets/JSON/payment-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getinvoicedraft() {
    return this.http.get<apiResultFormat>('assets/JSON/invoicedraft.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getinvoicerecurring() {
    return this.http
      .get<apiResultFormat>('assets/JSON/invoicerecurring.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getinvoicecancelled() {
    return this.http
      .get<apiResultFormat>('assets/JSON/invoicecancelled.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getinventory() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/inventory').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public updateinventory(inventory: any) {
    return this.http.put(this.backendUrl+`/inventory/${inventory.id}`, inventory);
  }

  public deleteinventory(id: number) {
    return this.http.delete(this.backendUrl+`/inventory/${id}`);
  }
  
  public getExpenses() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/expenses').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  
  public addExpense(expense: any) {
    return this.http.post(this.backendUrl+'/expenses', expense);
  }
  
  public editExpense(expense: any) {
    return this.http.put(this.backendUrl+`/expenses/${expense.id}`, expense);
  }

  public getExpenseByID(id: number) {
    return this.http.get(this.backendUrl+`/expenses/${id}`);
  }

  public getpurchase() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/purchase').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getpurchaseReturn() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/purchaseReturn').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  
  public addPurchaseProduct(product: any) {
    return this.http.post(this.backendUrl+'/products/addQuantity', product);
  }
  
  public removePurchaseProduct(product: any) {
    return this.http.post(this.backendUrl+'/products/removeQuantity', product);
  }

  public addPurchase(purchase: any) {
    return this.http.post(this.backendUrl+'/purchase', purchase);
  }
  public addPurchaseReturn(purchase: any) {
    return this.http.post(this.backendUrl+'/purchaseReturn', purchase);
  }

  public editPurchase(purchase: any) {
    return this.http.put(this.backendUrl+`/purchase/${purchase.id}`, purchase);
  }

  public editPurchaseReturn(purchase: any) {
    return this.http.put(this.backendUrl+`/purchaseReturn/${purchase.id}`, purchase);
  }
  
  public updatePurchaseStatus(purchaseId: number, status: string) {
    return this.http.put(this.backendUrl+`/purchase/status/${purchaseId}`, { status });
  }
  
  public deletepurchase(sNo: number) {
    return this.http.delete(this.backendUrl+`/purchase/${sNo}`);
  }
  public deletepurchaseReturn(sNo: number) {
    return this.http.delete(this.backendUrl+`/purchaseReturn/${sNo}`);
  }
  
  public getPurchaseById(id: number) {
    return this.http.get(this.backendUrl+`/purchase/${id}`);
  }

  public getPurchaseReturnById(id: number) {
    return this.http.get(this.backendUrl+`/purchaseReturn/${id}`);
  }
  
  public getDashboardData() {
    return this.http.get(this.backendUrl+`/dash`);
  }
  
  public getUCReservations() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/bookings/upcoming').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getpurchaseorder() {
    return this.http
      .get<apiResultFormat>('assets/JSON/purchaseorder.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getdebitnotes() {
    return this.http.get<apiResultFormat>('assets/JSON/debitnotes.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getquotation() {
    return this.http.get<apiResultFormat>('assets/JSON/quotations.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getpaymentsummary() {
    return this.http
      .get<apiResultFormat>('assets/JSON/paymentsummary.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getSubscribers() {
    return this.http.get<apiResultFormat>('assets/JSON/subscribers.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTransaction() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/transaction').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public addTransaction(transaction: any) {
    return this.http.post(this.backendUrl+'/transaction', transaction);
  }
  public getTransactionById(id: number) {
    return this.http.get(this.backendUrl+`/transaction/${id}`);
  }
  public updateTransaction(transaction: any) {
    return this.http.put(this.backendUrl+`/transaction/${transaction.id}`, transaction);
  }

  public getrole() {
    return this.http.get<apiResultFormat>('assets/JSON/role.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getdeleteaccount() {
    return this.http
      .get<apiResultFormat>('assets/JSON/deleteaccount.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }

  public getUsers() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/users').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public addUser(user: any) {
    return this.http.post(this.backendUrl+'/users', user);
  }

  public updateUser(user: any) {
    return this.http.put(this.backendUrl+`/users/${user.id}`, user);
  }

  public deleteUser(id: number) {
    return this.http.delete(this.backendUrl+`/users/${id}`);
  }

  public updateUserStatus(userId: number, status: string) {
    return this.http.patch(this.backendUrl+`/users/${userId}/status?status=${status}`, {});
  }

  public getaddpages() {
    return this.http.get<apiResultFormat>('assets/JSON/addpages.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getstates() {
    return this.http.get<apiResultFormat>('assets/JSON/states.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getblogcomments() {
    return this.http.get<apiResultFormat>('assets/JSON/blogcomments.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getsignature() {
    return this.http.get<apiResultFormat>('assets/JSON/signature.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getinvoiceone() {
    return this.http.get<apiResultFormat>('assets/JSON/invoiceone.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getCompanies() {
    return this.http.get<apiResultFormat>('assets/JSON/companies.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPurchaseReport() {
    return this.http
      .get<apiResultFormat>('assets/JSON/purchase-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPurchaseReturnReport() {
    return this.http
      .get<apiResultFormat>('assets/JSON/purchasereturn-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }

  public getExpense() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/reports/EXPENSE').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getInventoryExpense() {
    return this.http.get<apiResultFormat>(this.backendUrl+'/reports/INVENTORY').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getSubscription() {
    return this.http.get<apiResultFormat>('assets/JSON/subscription.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getSalesReports() {
    return this.http.get<apiResultFormat>('assets/JSON/sales-report.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getDomainRequest() {
    return this.http
      .get<apiResultFormat>('assets/JSON/domain-request.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getDomain() {
    return this.http.get<apiResultFormat>('assets/JSON/domain.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getPurchaseTransaction() {
    return this.http
      .get<apiResultFormat>('assets/JSON/purchase-transaction.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getTaxPurchase() {
    return this.http.get<apiResultFormat>('assets/JSON/tax-purchase.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getTaxPurchase2() {
    return this.http.get<apiResultFormat>('assets/JSON/tax-purchase2.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }
  public getSalesReturnReports() {
    return this.http
      .get<apiResultFormat>('assets/JSON/salesreturn-report.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPlanBilling() {
    return this.http
      .get<apiResultFormat>('assets/JSON/plan-billing.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getCustomField() {
    return this.http
      .get<apiResultFormat>('assets/JSON/custom-field.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getInventoryHistory() {
    return this.http
      .get<apiResultFormat>('assets/JSON/inventory-history.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getDataTables() {
    return this.http
      .get<apiResultFormat>('assets/JSON/data-tables.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
  public getPlansList() {
    return this.http
      .get<apiResultFormat>('assets/JSON/plans-list.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }
   
// eslint-disable-next-line @typescript-eslint/no-explicit-any
public sideBar: any[] = [
  {
    tittle: 'Main',
    active: false,
    icon: 'airplay',
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: 'Dashboard',
        route: routes.dashboard,
        hasSubRoute: true,
        showSubRoute: false,
        icon: 'home',
        base: 'dashboard',
        subMenus: [
          {
            separateRoute: true,
            menuValue: 'Admin Dashboard',
            tittle: 'Admin Dashboard',
            route: routes.dashboard,
            base: routes.dashboard,
            icon: 'home',
            showAsTab: false,
          },
          {
            separateRoute: true,
            menuValue: 'Calendar',
            tittle: 'Calendar',
            route: routes.calender,
            base: routes.calender,
            icon: 'calendar',
            showAsTab: false,
          },
        ],
      },
      // {
      //   menuValue: 'Applications',
      //   route: routes.application,
      //   hasSubRoute: true,
      //   showSubRoute: false,
      //   icon: 'grid',
      //   base: 'application',
      //   subMenus: [
      //     {
      //       separateRoute: true,
      //       menuValue: 'Chat',
      //       tittle: 'Chat',
      //       route: routes.chat,
      //       base: routes.chat,
      //       icon: 'message-square',
      //       showAsTab: false,
      //     },
      //     {
      //       separateRoute: true,
      //       menuValue: 'Calendar',
      //       tittle: 'Calendar',
      //       route: routes.calender,
      //       base: routes.calender,
      //       icon: 'calendar',
      //       showAsTab: false,
      //     },
      //     {
      //       separateRoute: true,
      //       menuValue: 'Email',
      //       tittle: 'Email',
      //       route: routes.email,
      //       base: routes.email,
      //       icon: 'mail',
      //       showAsTab: false,
      //     },
      //   ],
      // },
      // {
      //   menuValue: 'Super Admin',
      //   route: routes.application,
      //   hasSubRoute: true,
      //   showSubRoute: false,
      //   icon: 'user',
      //   base: 'super-admin',
      //   subMenus: [
      //     {
      //       separateRoute: true,
      //       menuValue: 'Dashboard',
      //       route: routes.superAdminDashboard,
      //       base: routes.superAdminDashboard,
      //       showAsTab: false,
      //     },
      //     {
      //       separateRoute: true,
      //       menuValue: 'Companies',
      //       route: routes.companies,
      //       base: routes.companies,
      //       showAsTab: false,
      //     },
      //     {
      //       separateRoute: true,
      //       menuValue: 'Subscription',
      //       route: routes.subscription,
      //       base: routes.subscription,
      //       showAsTab: false,
      //     },
      //     {
      //       separateRoute: true,
      //       menuValue: 'Packages',
      //       route: routes.packages,
      //       base: routes.packages,
      //       showAsTab: false,
      //     },
      //     {
      //       separateRoute: true,
      //       menuValue: 'Domain',
      //       route: routes.domain,
      //       base: routes.domain,
      //       showAsTab: false,
      //     },
      //     {
      //       separateRoute: true,
      //       menuValue: 'Purchase Transaction',
      //       route: routes.purchaseTransaction,
      //       base: routes.purchaseTransaction,
      //       showAsTab: false,
      //     },
      //   ],
      // },
      // {
      //   menuValue: 'Customer',
      //   route: routes.customer,
      //   view:false,
      //   hasSubRoute: true,
      //   showSubRoute: false,
      //   icon: 'users',
      //   base: 'customers',
      //   subMenus: [
      //     {
      //       separateRoute: true,
      //       menuValue: 'Customers',
      //       tittle: 'Customers',
      //       route: routes.customer,
      //       base: 'customer',
      //       icon: 'users',
      //       showAsTab: false,
      //     },
      //     {
      //       separateRoute: true,
      //       menuValue: 'Customer Details',
      //       tittle: 'Customer Details',
      //       route: routes.customerdetails,
      //       base: 'customerdetailspage',
      //       icon: 'file',
      //       showAsTab: false,
      //     },
      //     {
      //       separateRoute: true,
      //       menuValue: 'Vendors',
      //       tittle: 'Vendors',
      //       route: routes.vendorsList,
      //       base: 'vendors',
      //       icon: 'users',
      //       showAsTab: false,
      //     },
      //   ],
      // },
    ],
  },
  {
    tittle: 'Vendors',
    active: false,
    icon: '',
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: 'Accounts',
        route: routes.customer,
        hasSubRoute: false,
        showSubRoute: false,
        icon: 'users',
        base: 'customer',
        subMenus: [],
      },
      // {
      //   menuValue: 'Customer Details',
      //   route: routes.customerdetails,
      //   hasSubRoute: false,
      //   showSubRoute: false,
      //   icon: 'file',
      //   base: 'customerdetailspage',
      //   subMenus: [],
      // },
      {
        menuValue: 'Vendors',
        route: routes.vendorsList,
        hasSubRoute: false,
        showSubRoute: false,
        icon: 'users',
        base: 'vendors',
        subMenus: [],
      },
    ],
  },
  {
    tittle: 'Reservations',
    active: false,
    icon: '',
    showAsTab: false,
    separateRoute: false,
    menu: [
      // {
      //   menuValue: 'Customers',
      //   route: routes.customer,
      //   hasSubRoute: false,
      //   showSubRoute: false,
      //   icon: 'users',
      //   base: 'customer',
      //   subMenus: [],
      // },
      // {
      //   menuValue: 'Customer Details',
      //   route: routes.customerdetails,
      //   hasSubRoute: false,
      //   showSubRoute: false,
      //   icon: 'file',
      //   base: 'customerdetailspage',
      //   subMenus: [],
      // },
      {
        menuValue: 'Reservations',
        route: routes.reservations,
        hasSubRoute: true,
        showSubRoute: false,
        icon: 'users',
        base: 'estimates',
        subMenus: [
          {
            menuValue: 'Reservations',
            route: routes.reservationList,
            base: routes.reservationList,
          },
          {
            menuValue: 'Add Reservation',
            route: routes.addreservation,
            base: routes.addreservation,
          },
          {
            menuValue: 'Menus',
            route: routes.menu,
            base: routes.menu,
          },
          {
            menuValue: 'Menu-Items',
            route: routes.menuItems,
            base: routes.menuItems,
          },
          {
            menuValue: 'Additional Services',
            route: routes.additionalServices,
            base: routes.additionalServices,
          },
        ],
      },
    ],
  },
  {
    tittle: 'Inventory',
    active: false,
    icon: 'airplay',
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: 'Products',
        hasSubRoute: true,
        showSubRoute: false,
        icon: 'package',
        base: 'product-service',
        subMenus: [
          {
            menuValue: 'Product List',
            route: routes.productlist,
            base: routes.productlist,
          },
          {
            menuValue: 'Add Product',
            route: routes.addproducts,
            base: routes.addproducts,
          },
          {
            menuValue: 'Category',
            route: routes.category,
            base: routes.category,
          },
          {
            menuValue: 'Units',
            route: routes.units,
            base: routes.units,
          },
        ],
      },
      {
        menuValue: 'Inventory',
        route: routes.allInventory,
        hasSubRoute: false,
        showSubRoute: false,
        icon: 'users',
        base: 'inventory',
        subMenus: [],
      },
      {
        menuValue: 'Signature',
        route: routes.signaturelist,
        view:false,
        hasSubRoute: true,
        showSubRoute: false,
        icon: 'file-plus',
        base: 'signature-list',
        subMenus: [
          {
            separateRoute: true,
            menuValue: 'List of Signature',
            tittle: 'List of Signature',
            route: routes.signaturelist,
            base: routes.signaturelist,
            icon: 'clipboard',
            showAsTab: false,
          },
          {
            separateRoute: true,
            menuValue: 'Signature Invoice',
            tittle: 'Signature Invoice',
            route: routes.signatureinvoice,
            base: routes.signatureinvoice,
            icon: 'box',
            showAsTab: false,
          },
        ],
      },
    ],
  },
  // {
  //   tittle: 'Signature',
  //   active: false,
  //   icon: 'airplay',
  //   showAsTab: false,
  //   separateRoute: false,
  //   menu: [
  //     {
  //       menuValue: 'List of Signature',
  //       route: routes.signaturelist,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'clipboard',
  //       base: 'signature-list',
  //       subMenus: [],
  //     },
  //     {
  //       menuValue: 'Signature Invoice',
  //       route: routes.signatureinvoice,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'box',
  //       base: 'signature-invoice',
  //       subMenus: [],
  //     },
  //   ],
  // },
  // {
  //   tittle: 'Sales',
  //   active: false,
  //   icon: 'airplay',
  //   showAsTab: false,
  //   separateRoute: false,
  //   menu: [
  //     {
  //       menuValue: 'Transections',
  //       route: routes.dashboard,
  //       hasSubRoute: true,
  //       showSubRoute: false,
  //       icon: 'clipboard',
  //       base: 'invoices',
  //       subMenus: [
          // {
          //   menuValue: 'Transection List',
          //   route: routes.invoiceList,
          //   base: routes.invoiceList,
          // },
          // {
          //   menuValue: 'Invoice Details (Admin)',
          //   route: routes.invoicedetailsadmin,
          //   base: routes.invoicedetailsadmin,
          // },
          // {
          //   menuValue: 'Invoice Details (Customer)',
          //   route: routes.invoicedetails,
          //   base: routes.invoicedetails,
          // },
          // {
          //   menuValue: 'Invoices Template',
          //   route: routes.invoicetemplate,
          //   base: routes.invoicetemplate,
          // },
      //   ],
      // },
      // {
      //   menuValue: 'Recurring Invoices',
      //   route: routes.recurringinvoices,
      //   hasSubRoute: false,
      //   showSubRoute: false,
      //   icon: 'clipboard',
      //   base: 'recurring-pages',
      //   subMenus: [],
      // },
      // {
      //   menuValue: 'Credit Notes',
      //   route: routes.creditnotes,
      //   hasSubRoute: false,
      //   showSubRoute: false,
      //   icon: 'edit',
      //   base: 'credit-note-pages',
      //   subMenus: [],
      // },
  //   ],
  // },
  {
    tittle: 'Purchases',
    active: false,
    icon: 'airplay',
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: 'Purchases',
        // route: routes.purchase,
        hasSubRoute: true,
        showSubRoute: false,
        icon: 'shopping-cart',
        base: 'purchasepage',
        subMenus: [
          {
            menuValue: 'Purchase List',
            route: routes.purchase,
            base: routes.purchase,
          },
          {
            menuValue: 'Add Purchase',
            route: routes.addpurchases,
            base: routes.addpurchases,
          },
        ],
      },
      {
        menuValue: 'Purchase Returns',
        route: routes.purchaseorders,
        hasSubRoute: true,
        showSubRoute: false,
        icon: 'shopping-bag',
        base: 'purchase-return',
        subMenus: [
          {
            menuValue: 'Purchase Return List',
            route: routes.purchaseorders,
            base: routes.purchaseorders,
          },
          {
            menuValue: 'Add Purchase Return',
            route: routes.addpurchasreturn,
            base: routes.addpurchasreturn,
          },
        ],
      },
      // {
      //   menuValue: 'Debit Notes',
      //   route: routes.debitnotes,
      //   hasSubRoute: false,
      //   showSubRoute: false,
      //   icon: 'file-text',
      //   base: 'debit-notes',
      //   subMenus: [],
      // },
    ],
  },
  {
    tittle: 'Finance & Accounts',
    active: false,
    icon: 'airplay',
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: 'Expenses',
        // route: routes.expensesList,
        hasSubRoute: true,
        showSubRoute: false,
        icon: 'file-plus',
        base: 'expenses',
        subMenus: [
          {
            menuValue: 'Expenses',
            route: routes.expensesList,
            base: routes.expensesList,
          },
          {
            menuValue: 'Add Expense',
            route: routes.addexpenses,
            base: routes.addexpenses,
          },
        ],
      },
      {
        menuValue: 'Transactions',
        route: routes.transactionList,
        hasSubRoute: true,
        showSubRoute: false,
        icon: 'credit-card',
        base: 'payments',
        subMenus: [
          {
            menuValue: 'Transaction List',
            route: routes.transactionList,
            base: routes.transactionList,
          },
          {
            menuValue: 'Add Transaction',
            route: routes.addTransaction,
            base: routes.addTransaction,
          },
          {
            menuValue: 'Vouchers',
            route: routes.voucherList,
            base: routes.voucherList,
          },
        ],
      },
      {
        menuValue: 'Salaries',
        route: routes.salariesList,
        hasSubRoute: false,
        showSubRoute: false,
        icon: 'clipboard',
        base: 'salaries',
        subMenus: [],
      },
    ],
  },
  // {
  //   tittle: 'Quotations',
  //   active: false,
  //   icon: 'airplay',
  //   showAsTab: false,
  //   separateRoute: false,
  //   menu: [
  //     {
  //       menuValue: 'Quotations',
  //       route: routes.quotations,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'clipboard',
  //       base: 'quotationspage',
  //       subMenus: [],
  //     },
  //     {
  //       menuValue: 'Delivery Challans',
  //       route: routes.deliveryChallansList,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'file-text',
  //       base: 'delivery-challans',
  //       subMenus: [],
  //     },
  //   ],
  // },
  {
    tittle: 'Reports',
    active: false,
    icon: 'airplay',
    showAsTab: false,
    separateRoute: false,
    menu: [
      // {
      //   menuValue: 'Payment Summary',
      //   route: routes.paymentsummary,
      //   hasSubRoute: false,
      //   showSubRoute: false,
      //   icon: 'credit-card',
      //   base: 'payment-summary',
      //   subMenus: [],
      // },
      {
        menuValue: 'Reports',
        hasSubRoute: true,
        showSubRoute: false,
        icon: 'box',
        base: 'report',
        subMenus: [
          {
            menuValue: 'Expense Report',
            route: routes.expenseReport,
            base: routes.expenseReport,
          },
          {
            menuValue: 'Event Expense Report',
            route: routes.eventexpenseReport,
            base: routes.eventexpenseReport,
          },
          {
            menuValue: 'Food Expense Report',
            route: routes.foodexpenseReport,
            base: routes.foodexpenseReport,
          },
          {
            menuValue: 'Purchase Report',
            route: routes.purchaseReport,
            base: routes.purchaseReport,
          },
          {
            menuValue: 'Purchase Return Report',
            route: routes.purchaseReturnReport,
            base: routes.purchaseReturnReport,
          },
          {
            menuValue: 'Sales Report',
            route: routes.salesReport,
            base: routes.salesReport,
          },
          {
            menuValue: 'Sales Return Report',
            route: routes.salesReturnReport,
            base: routes.salesReturnReport,
          },
          {
            menuValue: 'Quotation Report',
            route: routes.quotationReport,
            base: routes.quotationReport,
          },
          {
            menuValue: 'Payment Report',
            route: routes.paymentReport,
            base: routes.paymentReport,
          },
          {
            menuValue: 'Stock Report',
            route: routes.stockReport,
            base: routes.stockReport,
          },
          {
            menuValue: 'Low Stock Report',
            route: routes.lowStockReport,
            base: routes.lowStockReport,
          },
          {
            menuValue: 'Income Report',
            route: routes.incomeReport,
            base: routes.incomeReport,
          },
          {
            menuValue: 'Tax Report',
            route: routes.taxPurchase,
            base: routes.taxPurchase,
          },
          {
            menuValue: 'Profit & Loss',
            route: routes.profitLoss,
            base: routes.profitLoss,
          },
        ],
      },
    ],
  },
  {
    tittle: 'Management',
    active: false,
    icon: 'airplay',
    showAsTab: false,
    separateRoute: false,
    menu: [
      {
        menuValue: 'Users',
        route: routes.users,
        hasSubRoute: false,
        showSubRoute: false,
        icon: 'user',
        base: 'manageusers',
        subMenus: [],
      },
      {
        menuValue: 'Settings',
        route: routes.companysettings,
        hasSubRoute: false,
        showSubRoute: false,
        icon: 'settings',
        base: 'settings',
        subMenus: [],
      },
      // {
      //   menuValue: 'Roles & Permission',
      //   route: routes.rolespermission,
      //   hasSubRoute: false,
      //   showSubRoute: false,
      //   icon: 'clipboard',
      //   base: 'roles-permission',
      //   subMenus: [],
      // },
      // {
      //   menuValue: 'Delete Account Request',
      //   route: routes.deleteaccountrequest,
      //   hasSubRoute: false,
      //   showSubRoute: false,
      //   icon: 'trash-2',
      //   base: 'delete-account-request',
      //   subMenus: [],
      // },
    ],
  },
  // {
  //   tittle: 'Membership',
  //   active: false,
  //   icon: 'airplay',
  //   showAsTab: false,
  //   separateRoute: false,
  //   menu: [
  //     {
  //       menuValue: 'Membership',
  //       route: routes.membership,
  //       hasSubRoute: true,
  //       showSubRoute: false,
  //       icon: 'book',
  //       base: 'membership',
  //       subMenus: [
  //         {
  //           menuValue: 'Membership Plans',
  //           route: routes.membershipplans,
  //           base: routes.membershipplans,
  //         },
  //         {
  //           menuValue: 'Membership Addons',
  //           route: routes.membershipaddons,
  //           base: routes.membershipaddons,
  //         },
  //         {
  //           menuValue: 'Subscribers',
  //           route: routes.subscribers,
  //           base: routes.subscribers,
  //         },
  //         {
  //           menuValue: 'Transactions',
  //           route: routes.transactions,
  //           base: routes.transactions,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   tittle: 'Content (CMS)',
  //   active: false,
  //   icon: 'file',
  //   showAsTab: false,
  //   separateRoute: false,
  //   menu: [
  //     {
  //       menuValue: 'Pages',
  //       route: routes.pages,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'folder',
  //       base: 'pages',
  //       subMenus: [],
  //     },
  //     {
  //       menuValue: 'Blogs',
  //       route: routes.blogs,
  //       hasSubRoute: true,
  //       showSubRoute: false,
  //       icon: 'grid',
  //       base: 'blog',
  //       subMenus: [
  //         {
  //           menuValue: 'All Blogs',
  //           route: routes.allBlogs,
  //           base: routes.allBlogs,
  //         },
  //         {
  //           menuValue: 'Categories',
  //           route: routes.categories,
  //           base: routes.categories,
  //         },
  //         {
  //           menuValue: 'Blog comments',
  //           route: routes.blogcomments,
  //           base: routes.blogcomments,
  //         },
  //       ],
  //     },
  //     {
  //       menuValue: 'Location',
  //       route: routes.paymentsList,
  //       hasSubRoute: true,
  //       showSubRoute: false,
  //       icon: 'map-pin',
  //       base: 'location',
  //       subMenus: [
  //         {
  //           menuValue: 'Countries',
  //           route: routes.countries,
  //           base: routes.countries,
  //         },
  //         {
  //           menuValue: 'States',
  //           route: routes.states,
  //           base: routes.states,
  //         },
  //         {
  //           menuValue: 'Cities',
  //           route: routes.cities,
  //           base: routes.cities,
  //         },
  //       ],
  //     },
  //     {
  //       menuValue: 'Testimonials',
  //       route: routes.testimonials,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'message-square',
  //       base: 'testimonial-page',
  //       subMenus: [],
  //     },
  //     {
  //       menuValue: 'FAQ',
  //       route: routes.faq,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'alert-circle',
  //       base: 'faq',
  //       subMenus: [],
  //     },
  //   ],
  // },
  // {
  //   tittle: 'Support',
  //   active: false,
  //   icon: 'airplay',
  //   showAsTab: false,
  //   separateRoute: false,
  //   menu: [
  //     {
  //       menuValue: 'Contact Messages',
  //       route: routes.contactmessages,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'printer',
  //       base: 'contact-messages',
  //       subMenus: [],
  //     },
  //     {
  //       menuValue: 'Tickets',
  //       route: routes.tickets,
  //       hasSubRoute: true,
  //       showSubRoute: false,
  //       icon: 'save',
  //       base: 'tickets',
  //       subMenus: [
  //         {
  //           menuValue: 'Tickets',
  //           route: routes.tickets,
  //           base: routes.tickets,
  //         },
  //         {
  //           menuValue: 'Tickets List',
  //           route: routes.ticketslist,
  //           base: routes.ticketslist,
  //         },
  //         {
  //           menuValue: 'Tickets Kanban',
  //           route: routes.ticketskanban,
  //           base: routes.ticketskanban,
  //         },
  //         {
  //           menuValue: 'Ticket Overview',
  //           route: routes.ticketdetails,
  //           base: routes.ticketdetails,
  //         },
  //       ],
  //     },
  //   ],
  // },

  // {
  //   tittle: 'Pages',
  //   active: false,
  //   icon: 'file',
  //   showAsTab: false,
  //   separateRoute: false,
  //   menu: [
  //     {
  //       menuValue: 'Profile',
  //       route: routes.profile,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'user-plus',
  //       base: 'profile',
  //       subMenus: [],
  //     },
  //     {
  //       menuValue: 'Authentication',
  //       route: routes.dashboard,
  //       hasSubRoute: true,
  //       showSubRoute: false,
  //       icon: 'lock',
  //       base: '',
  //       subMenus: [
  //         { menuValue: 'Login', route: routes.login, base: routes.login },
  //         {
  //           menuValue: 'Register',
  //           route: routes.register,
  //           base: routes.register,
  //         },
  //         {
  //           menuValue: 'Forgot Password',
  //           route: routes.forgot_password,
  //           base: routes.forgot_password,
  //         },
  //         {
  //           menuValue: 'Lock Screen',
  //           route: routes.lock_screen,
  //           base: routes.lock_screen,
  //         },
  //       ],
  //     },

  //     {
  //       menuValue: 'Error Pages',
  //       route: routes.errorPage404,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'alert-octagon',
  //       base: '1',
  //     },
  //     {
  //       menuValue: 'Blank Page',
  //       route: routes.blankPage,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'file',
  //       base: 'blank-page',
  //       subMenus: [],
  //     },
  //     {
  //       menuValue: 'Google Maps',
  //       route: routes.googleMaps,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'map-pin',
  //       base: 'google-maps',
  //       subMenus: [],
  //     },
  //   ],
  // },
  // {
  //   tittle: 'UI Interface',
  //   active: false,
  //   icon: 'layers',
  //   showAsTab: false,
  //   separateRoute: false,
  //   menu: [
  //     {
  //       menuValue: 'Base UI',
  //       route: routes.dashboard,
  //       hasSubRoute: true,
  //       showSubRoute: false,
  //       icon: 'shield',
  //       base: 'base-ui',
  //       subMenus: [
  //         {
  //           menuValue: 'Alerts',
  //           route: routes.alert,
  //           base: routes.alert,
  //         },
  //         {
  //           menuValue: 'Accordions',
  //           route: routes.accordions,
  //           base: routes.accordions,
  //         },
  //         { menuValue: 'Avatar', route: routes.avatar, base: routes.avatar },
  //         { menuValue: 'Badges', route: routes.badges, base: routes.badges },
  //         {
  //           menuValue: 'Buttons',
  //           route: routes.buttons,
  //           base: routes.buttons,
  //         },
  //         {
  //           menuValue: 'Button Group',
  //           route: routes.buttonGroup,
  //           base: routes.buttonGroup,
  //         },
  //         {
  //           menuValue: 'Breadcrumb',
  //           route: routes.breadcrumb,
  //           base: routes.breadcrumb,
  //         },
  //         { menuValue: 'Cards', route: routes.cards, base: routes.cards },
  //         {
  //           menuValue: 'Carousel',
  //           route: routes.carousel,
  //           base: routes.carousel,
  //         },
  //         {
  //           menuValue: 'Dropdowns',
  //           route: routes.dropDown,
  //           base: routes.dropDown,
  //         },
  //         { menuValue: 'Grid', route: routes.grid, base: routes.grid },
  //         { menuValue: 'Images', route: routes.images, base: routes.images },
  //         {
  //           menuValue: 'Lightbox',
  //           route: routes.lightBox,
  //           base: routes.lightBox,
  //         },
  //         { menuValue: 'Media', route: routes.media, base: routes.media },
  //         { menuValue: 'Modals', route: routes.modal, base: routes.modal },
  //         {
  //           menuValue: 'Offcanvas',
  //           route: routes.offcanvas,
  //           base: routes.offcanvas,
  //         },
  //         {
  //           menuValue: 'Pagination',
  //           route: routes.pagination,
  //           base: routes.pagination,
  //         },

  //         {
  //           menuValue: 'Progress Bars',
  //           route: routes.progressBars,
  //           base: routes.progressBars,
  //         },
  //         {
  //           menuValue: 'Placeholders',
  //           route: routes.placeholder,
  //           base: routes.placeholder,
  //         },
          
  //         {
  //           menuValue: 'Spinner',
  //           route: routes.spinner,
  //           base: routes.rangeSlider,
  //         },
  //         { menuValue: 'Tabs', route: routes.tabs, base: routes.tabs },
  //         { menuValue: 'Toasts', route: routes.toasts, base: routes.toasts },
  //         {
  //           menuValue: 'Tooltip',
  //           route: routes.tooltip,
  //           base: routes.tooltip,
  //         },
  //         {
  //           menuValue: 'Typography',
  //           route: routes.typography,
  //           base: routes.typography,
  //         },
  //         { menuValue: 'Videos', route: routes.video, base: routes.video },
  //       ],
  //     },
  //     {
  //       menuValue: 'Elements',
  //       route: routes.dashboard,
  //       hasSubRoute: true,
  //       showSubRoute: false,
  //       icon: 'box',
  //       base: 'elements',
  //       subMenus: [
  //         { menuValue: 'Ribbon', route: routes.ribbon, base: routes.ribbon },
  //         {
  //           menuValue: 'Clipboard',
  //           route: routes.clipboards,
  //           base: routes.clipboards,
  //         },
  //         {
  //           menuValue: 'Drag & Drop',
  //           route: routes.dragDrop,
  //           base: routes.dragDrop,
  //         },
  //         {
  //           menuValue: 'Rating',
  //           route: routes.rating,
  //           base: routes.rating,
  //         },
  //         {
  //           menuValue: 'Text Editor',
  //           route: routes.textEditor,
  //           base: routes.textEditor,
  //         },
  //         {
  //           menuValue: 'Counter',
  //           route: routes.counter,
  //           base: routes.counter,
  //         },
  //         {
  //           menuValue: 'Scrollbar',
  //           route: routes.scrollbar,
  //           base: routes.scrollbar,
  //         },
  //         {
  //           menuValue: 'Notification',
  //           route: routes.notification,
  //           base: routes.notification,
  //         },

  //         {
  //           menuValue: 'Timeline',
  //           route: routes.timeline,
  //           base: routes.timeline,
  //         },
  //         {
  //           menuValue: 'Horizontal Timeline',
  //           route: routes.horizontal,
  //           base: routes.horizontal,
  //         },
  //         {
  //           menuValue: 'Form Wizard',
  //           route: routes.formWizard,
  //           base: routes.formWizard,
  //         },
  //       ],
  //     },
  //     {
  //       menuValue: 'Charts',
  //       route: routes.dashboard,
  //       hasSubRoute: true,
  //       showSubRoute: false,
  //       icon: 'bar-chart-2',
  //       base: 'chart',
  //       subMenus: [
  //         {
  //           menuValue: 'Apex Charts',
  //           route: routes.apexChart,
  //           base: routes.apexChart,
  //         },
  //         {
  //           menuValue: 'Ng2 Charts',
  //           route: routes.ngTwoCharts,
  //           base: routes.ngTwoCharts,
  //         }
  //       ],
  //     },
  //     {
  //       menuValue: 'Icons',
  //       route: routes.dashboard,
  //       hasSubRoute: true,
  //       showSubRoute: false,
  //       icon: 'award',
  //       base: 'icon',
  //       subMenus: [
  //         {
  //           menuValue: 'Fontawesome Icons',
  //           route: routes.fontawesome,
  //           base: routes.fontawesome,
  //         },
  //         {
  //           menuValue: 'Feather Icons',
  //           route: routes.feather,
  //           base: routes.feather,
  //         },
  //         {
  //           menuValue: 'Ionic Icons',
  //           route: routes.ionic,
  //           base: routes.ionic,
  //         },
  //         {
  //           menuValue: 'Material Icons',
  //           route: routes.material,
  //           base: routes.material,
  //         },
  //         { menuValue: 'pe7 Icons', route: routes.pe7, base: routes.pe7 },
  //         {
  //           menuValue: 'Simpleline Icons',
  //           route: routes.simpleLine,
  //           base: routes.simpleLine,
  //         },
  //         {
  //           menuValue: 'Themify Icons',
  //           route: routes.themify,
  //           base: routes.themify,
  //         },
  //         {
  //           menuValue: 'Weather Icons',
  //           route: routes.weather,
  //           base: routes.weather,
  //         },
  //         {
  //           menuValue: 'Typicon Icons',
  //           route: routes.typicon,
  //           base: routes.typicon,
  //         },
  //         { menuValue: 'Flag Icons', route: routes.flag, base: routes.flag },
  //       ],
  //     },
  //     {
  //       menuValue: 'Forms',
  //       route: routes.dashboard,
  //       hasSubRoute: true,
  //       showSubRoute: false,
  //       icon: 'file-plus',
  //       base: 'forms',
  //       subMenus: [
  //         {
  //           menuValue: 'Basic Inputs',
  //           route: routes.basicForm,
  //           base: routes.basicForm,
  //         },
  //         {
  //           menuValue: 'Input Groups',
  //           route: routes.inputGroups,
  //           base: routes.inputGroups,
  //         },
  //         {
  //           menuValue: 'Horizontal Form',
  //           route: routes.horizontalForm,
  //           base: routes.horizontalForm,
  //         },
  //         {
  //           menuValue: 'Vertical Form',
  //           route: routes.verticalForm,
  //           base: routes.verticalForm,
  //         },
  //         {
  //           menuValue: 'Form Mask',
  //           route: routes.formMask,
  //           base: routes.formMask,
  //         },
  //         {
  //           menuValue: 'Form Validation',
  //           route: routes.formValidation,
  //           base: routes.formValidation,
  //         },
  //         {
  //           menuValue: 'Form Select2',
  //           route: routes.formSelect2,
  //           base: routes.formSelect2,
  //         },
  //         {
  //           menuValue: 'File Upload',
  //           route: routes.fileUpload,
  //           base: routes.fileUpload,
  //         },
  //       ],
  //     },
  //     {
  //       menuValue: 'Tables',
  //       route: routes.dashboard,
  //       hasSubRoute: true,
  //       showSubRoute: false,
  //       icon: 'alert-octagon',
  //       base: 'tables',
  //       subMenus: [
  //         {
  //           menuValue: 'Basic Tables',
  //           route: routes.basicTable,
  //           base: routes.basicTable,
  //         },
  //         {
  //           menuValue: 'Data Tables',
  //           route: routes.dataTable,
  //           base: routes.dataTable,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   tittle: 'Settings',
  //   active: false,
  //   icon: 'airplay',
  //   showAsTab: false,
  //   separateRoute: false,
  //   menu: [
  //     {
  //       menuValue: 'Settings',
  //       route: routes.companysettings,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'settings',
  //       base: 'settings',
  //       subMenus: [],
  //     },
  //     {
  //       menuValue: 'Logout',
  //       route: routes.login,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'power',
  //       base: 'power',
  //       subMenus: [],
  //     },
  //   ],
  // },
  // {
  //   tittle: 'Extras',
  //   active: false,
  //   icon: 'airplay',
  //   showAsTab: false,
  //   separateRoute: false,
  //   menu: [
  //     {
  //       menuValue: 'Documentation',
      
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'file-text',
  //       base: 'file-text',
  //       subMenus: [],
  //     },
  //     {
  //       menuValue: 'Change Log',
  //       changeLogVersion: true,
  //       hasSubRoute: false,
  //       showSubRoute: false,
  //       icon: 'lock',
  //       base: 'lock',
  //       subMenus: [],
  //     }
      
  //   ],
  // },
];

public getSideBarData: BehaviorSubject<Array<SideBarData>> =
  new BehaviorSubject<Array<SideBarData>>(this.sideBar);

public resetData(): void {
  this.sideBar.map((res: SideBar ) => {
    res.showAsTab = false;
    res.menu.map((menus: SideBarMenu) => {
      menus.showSubRoute = false;
    });
  });
}
public planBillingOwl = [
  {
    name: 'Basic',
    remainingDays: '36 days remaining',
    price: '$49.99',
    billingPeriod: 'Monthly',
    text: "Cancel Subscription",
    img: 'assets/img/icons/basic.svg',
    customClass: true
  },
  {
    name: 'ENTERPRISES',
    remainingDays: '365 days remaining',
    price: '$199.99',
    billingPeriod: 'Yearly',
    text: "Upgrade",
    img: 'assets/img/icons/basic.svg',
    customClass: false
  },
  {
    name: 'Basic',
    remainingDays: '36 days remaining',
    price: '$49.99',
    billingPeriod: 'Monthly',
    text: "Cancel Subscription",
    img: 'assets/img/icons/basic.svg',
    customClass: false
  },
  {
    name: 'ENTERPRISES',
    remainingDays: '365 days remaining',
    price: '$199.99',
    billingPeriod: 'Yearly',
    text: "Upgrade",
    img: 'assets/img/icons/basic.svg',
    customClass: false
  },
];
}
