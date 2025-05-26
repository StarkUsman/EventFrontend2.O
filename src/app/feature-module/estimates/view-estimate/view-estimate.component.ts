import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { routes, DataService } from 'src/app/core/core.index';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  apiResultFormat,
  pageSelection,
  vendor,
} from 'src/app/core/models/models';
import { PaginationService, tablePageSize } from 'src/app/shared/sharedIndex';
@Component({
  selector: 'app-view-estimate',
  templateUrl: './view-estimate.component.html',
  styleUrls: ['./view-estimate.component.scss'],
})
export class ViewEstimateComponent  implements OnInit {
  control = new FormControl();
  public routes = routes;
  menus: any[] = [];
  additionalServices: any[] = [];
  filteredOptions!: Observable<string[]>;
  accounts: any = [];
  allAccounts: any = [];
  unfilteredData: any = [];
  public Toggledata = false;
  public reservations: Array<any> = [];
  public pageSize = 10;
  public serialNumberArray: Array<number> = [];
  public totalData = 0;
  showFilter = false;
  dataSource!: MatTableDataSource<any>;
  reservationToDelete: any = {};

  constructor(private data: DataService, private http: HttpClient, private router: Router, private pagination: PaginationService) {
    this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
      if (this.router.url == this.routes.reservationList) {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
      }
    });
  }

  private getTableData(pageOption: pageSelection): void {
    this.data.getReservations().subscribe((apiRes: apiResultFormat) => {
      this.reservations = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.reservations.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.unfilteredData = structuredClone(apiRes.data);
      this.dataSource = new MatTableDataSource<any>(this.reservations);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.reservations,
        tableData2: [],
        serialNumberArray: this.serialNumberArray,
      });
    });
  }

  ngOnInit() {
    this.data.getAssetAccounts().subscribe((res: any) => {
      this.allAccounts = res.data;
      for (let i = 0; i < res.data.length; i++) {
        this.accounts.push(res.data[i].name);
      }

      this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      );
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.accounts.filter((option: any) => option.toLowerCase().includes(filterValue));
  }

  public sortData(sort: Sort) {
    const data = this.reservations.slice();

    if (!sort.active || sort.direction === '') {
      this.reservations = data;
    } else {
      this.reservations = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];
        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  selectAccount(account: any) {
    this.reservationToAddPayment.account = this.allAccounts.find((acc: any) => acc.name === account);
  }

  addReservation() {
    this.router.navigate(['/reservations/add-reservation']);
  }

  setReservationToDelete(reservation: any) {
    this.reservationToDelete = reservation;
  }

  deleteReservation() {
    let reservationBeingDeleted = structuredClone(this.reservationToDelete);

    reservationBeingDeleted.additional_services.forEach((service: any) => {
      if(service.additional_service_name === "Audio System"){
        this.data.getVendorByName("SOUND").subscribe((res: any) => {
          let ledgerDetails = {
            vendor_id: res.vendor_id,
            name: "RES:" + reservationBeingDeleted.reservation_name,
            amountDebit: service.totalPrice,
          }

          this.data.getServiceLedger(ledgerDetails).subscribe((res: any) => {
            let ledgerToDelete = res.data[0];
            if(ledgerToDelete){
              this.data.deleteLedgerById(ledgerToDelete.id).subscribe(() => {});
            }
          })
        })
      } else if(service.additional_service_name === "Stage Decor"){
        this.data.getVendorByName("STAGE DECORE").subscribe((res: any) => {
          let ledgerDetails = {
            vendor_id: res.vendor_id,
            name: "RES:" + reservationBeingDeleted.reservation_name,
            amountDebit: service.totalPrice,
          }

          this.data.getServiceLedger(ledgerDetails).subscribe((res: any) => {
            let ledgerToDelete = res.data[0];
            if(ledgerToDelete){
              this.data.deleteLedgerById(ledgerToDelete.id).subscribe(() => {});
            }
          })
        })
      }
    });

    this.data.getReservationLedgerById(reservationBeingDeleted.booking_id).subscribe((res: any) => {
      if(res.data.length > 0) {
        res.data.forEach((ledger: any) => {
          this.data.deleteLedgerById(ledger.ledgerId).subscribe(() => {});
          if(ledger.trans_id){
            this.data.deleteTransaction(ledger.trans_id).subscribe(() => {});
          }
          this.data.deleteReservationLedgerById(ledger.id).subscribe(() => {});
        })
      }
    });

    this.data.deleteReservation(reservationBeingDeleted.booking_id).subscribe((res: any) => {
      this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
        this.reservationToDelete = {};
      });
    });
  }
  
  reservationToCancel: any = {};

  setReservationToCancel(reservation: any) {
    this.reservationToCancel = reservation;
  }

  cancelReservation() {
    let reservationBeingCancelled = structuredClone(this.reservationToCancel);
    
    reservationBeingCancelled.additional_services.forEach((service: any) => {
      if(service.additional_service_name === "Audio System"){
        this.data.getVendorByName("SOUND").subscribe((res: any) => {
          let ledgerDetails = {
            vendor_id: res.vendor_id,
            name: "RES:" + reservationBeingCancelled.reservation_name,
            amountDebit: service.totalPrice,
          }

          this.data.getServiceLedger(ledgerDetails).subscribe((res: any) => {
            let ledgerToDelete = res.data[0];
            if(ledgerToDelete){
              this.data.deleteLedgerById(ledgerToDelete.id).subscribe(() => {});
            }
          })
        })
      } else if(service.additional_service_name === "Stage Decor"){
        this.data.getVendorByName("STAGE DECORE").subscribe((res: any) => {
          let ledgerDetails = {
            vendor_id: res.vendor_id,
            name: "RES:" + reservationBeingCancelled.reservation_name,
            amountDebit: service.totalPrice,
          }

          this.data.getServiceLedger(ledgerDetails).subscribe((res: any) => {
            let ledgerToDelete = res.data[0];
            if(ledgerToDelete){
              this.data.deleteLedgerById(ledgerToDelete.id).subscribe(() => {});
            }
          })
        })
      }
    });

    let cashInHandAccount: any = {};

    if(reservationBeingCancelled.amountToReturn > 0){
      this.data.getVendorByName("CASH IN HAND").subscribe((res: any) => {
        cashInHandAccount = res;
        let ledger = {
          name: "RES:" + reservationBeingCancelled.reservation_name + ' (CANCELLED)',
          purch_id: reservationBeingCancelled.booking_id,
          vendor_id: res.vendor_id,
          amountDebit: reservationBeingCancelled.amountToReturn,
          amountCredit: 0,
        }

        this.data.addLedger(ledger).subscribe((res: any) => {
          this.addNegativeReservationLedger(res, reservationBeingCancelled, cashInHandAccount);
        });
      })
    }
      
    // ======================================================
    let requestBody = {
      id: this.reservationToCancel.booking_id,
      status: 'CANCELLED',
      SLOT: {}
    };

    this.data.cancelReservation(requestBody).subscribe((res: any) => {
      this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
        this.getTableData({ skip: res.skip, limit: res.limit });
        this.pageSize = res.pageSize;
        this.reservationToCancel = null;
      });
    });
  }

  reservationToAddPayment: any = {};
  setReservationToAddPayment(reservation: any){
    this.reservationToAddPayment = reservation;
    this.reservationToAddPayment.status = this.reservationToAddPayment.status ? this.reservationToAddPayment.status : 'OPEN';
  }

  addLedger() {
    let ledger = {
      name: "RES:"+this.reservationToAddPayment.reservation_name,
      purch_id: this.reservationToAddPayment.booking_id,
      vendor_id: this.reservationToAddPayment.account.id,
      amountDebit: 0,
      amountCredit: this.reservationToAddPayment.paymentToAdd,
    };

    this.data.addLedger(ledger).subscribe((res) => {
      this.addReservationLedger(res);
    });
  }

  addReservationLedger(res: any) {
    let ledger = {
      booking_id: this.reservationToAddPayment.booking_id,
      user: JSON.parse(localStorage.getItem('user') || '{}').firstName + ' ' + JSON.parse(localStorage.getItem('user') || '{}').lastName,
      amount: this.reservationToAddPayment.paymentToAdd,
      account: this.reservationToAddPayment.account.name,
      ledgerId: res.id,
      trans_id: undefined,
    };

    this.data.getTransaction().subscribe((res: any) => {
      let purch_id = res.data[res.data.length-1] ? res.data[res.data.length-1].trans_id : 100;
      purch_id = parseInt(purch_id) + 1;

      let debitAccount = {
        name: this.reservationToAddPayment.reservation_name,
        phone: this.reservationToAddPayment.contact_number || this.reservationToAddPayment.alt_contact_number,
      }

      let transaction = {
        trans_id: purch_id,
        date: new Date(),
        amount: this.reservationToAddPayment.paymentToAdd,
        creditAccount: this.reservationToAddPayment.account,
        debitAccount: debitAccount,
        voucher: 'RES:' + this.reservationToAddPayment.reservation_name,
      }
      
      this.data.addTransaction(transaction).subscribe((res: any) => {
        ledger.trans_id = res.id;
        this.data.addReservationLedger(ledger).subscribe((res) => {
          let requestBody = {
            id: this.reservationToAddPayment.booking_id,
            paymentToAdd: this.reservationToAddPayment.paymentToAdd,
          }
          
          this.data.addReservationPayment(requestBody).subscribe((res: any) => {
            // this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
            //   this.getTableData({ skip: res.skip, limit: res.limit });
            //   this.pageSize = res.pageSize;
            //   this.reservationToAddPayment = {};
            //   this.control.setValue('');
            // });
            window.location.reload();
          });
        });
      });
    });  
  }

  addNegativeReservationLedger(res: any, reservationBeingCancelled: any, debitAccount: any) {
    console.log(reservationBeingCancelled);
    console.log(res);
    let ledger = {
      booking_id: reservationBeingCancelled.booking_id,
      user: JSON.parse(localStorage.getItem('user') || '{}').firstName + ' ' + JSON.parse(localStorage.getItem('user') || '{}').lastName,
      amount: -reservationBeingCancelled.amountToReturn,
      account: "CASH IN HAND",
      ledgerId: res.id,
      trans_id: undefined,
    };

    this.data.getTransaction().subscribe((res: any) => {
      let purch_id = res.data[res.data.length-1] ? res.data[res.data.length-1].trans_id : 100;
      purch_id = parseInt(purch_id) + 1;

      let creditAccount = {
        name: reservationBeingCancelled.reservation_name,
        phone: this.reservationToAddPayment.contact_number || this.reservationToAddPayment.alt_contact_number,
      }

      let transaction = {
        trans_id: purch_id,
        date: new Date(),
        amount: reservationBeingCancelled.amountToReturn,
        creditAccount: creditAccount,
        debitAccount: debitAccount,
        voucher: 'RES:' + this.reservationToAddPayment.reservation_name + ' (CANCELLED)',
      }
      
      this.data.addTransaction(transaction).subscribe((res: any) => {
        ledger.trans_id = res.id;
        this.data.addReservationLedger(ledger).subscribe((res) => {
          // let requestBody = {
          //   id: this.reservationToAddPayment.booking_id,
          //   paymentToAdd: this.reservationToAddPayment.paymentToAdd,
          // }
          window.location.reload();
          
          // this.data.addReservationPayment(requestBody).subscribe((res: any) => {
          // });
        });
      });
    });  
  }

  addAmount(){
    this.addLedger();
  }

  queryString: string = '';
  async searchCustomers(){
    this.reservations = structuredClone(this.unfilteredData);
    this.reservations = this.reservations.filter((reservation) => {
      return (
        reservation.reservation_name.toLowerCase().includes(this.queryString.toLowerCase()) ||
        reservation.contact_number.toLowerCase().includes(this.queryString.toLowerCase()) ||
        reservation.alt_contact_number?.toLowerCase().includes(this.queryString.toLowerCase()) ||
        reservation.description?.toLowerCase().includes(this.queryString.toLowerCase()) ||
        reservation.SLOT.hall.toLowerCase().includes(this.queryString.toLowerCase()) ||
        reservation.status?.toLowerCase().includes(this.queryString.toLowerCase())
      );
    });
  }
}
