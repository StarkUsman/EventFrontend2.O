import { Component, OnInit } from '@angular/core';
import { DataService, routes } from 'src/app/core/core.index';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-purchases-details',
  templateUrl: './purchases-details.component.html',
  styleUrls: ['./purchases-details.component.scss']
})
export class PurchasesDetailsComponent implements OnInit {
  public routes = routes;
  reservationToView: any = {};
  ledgerToView: any = [];
  menuItems: any = [];
  companySettings: any = {};

  constructor(private route: ActivatedRoute, private data: DataService) { }

  ngOnInit(): void {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    this.companySettings = JSON.parse(localStorage.getItem('companySettings') || '{}');
    this.route.queryParams.subscribe(params => {
      let id = params['id'];
      this.data.getReservationById(id).subscribe((res: any) => {
        res.date = new Date(res.date).toLocaleString('en-US', options);
        res.dashboardDate = new Date(res.dashboardDate).toLocaleString('en-US', options);
        this.reservationToView = res;

        this.data.getReservationLedgerById(id).subscribe((res: any) => {
          res.data.forEach((item: any) => {
            item.date = new Date(item.date).toLocaleString('en-US', options);
          });
          this.ledgerToView = res.data;
        });

        this.data.getMenuItems().subscribe((res: any) => {
          // filter res and get only the items whose menu_item_id is in reservationToView.menu_items_ids
          this.menuItems = res.filter((item: any) => {
            return this.reservationToView.menu_items_ids.includes(item.menu_item_id);
          });
          // sort menuItems by menu_item_id
          // this.menuItems.sort((a: any, b: any) => {
          //   return this.reservationToView.menu_items_ids.indexOf(a.menu_item_id) - this.reservationToView.menu_items_ids.indexOf(b.menu_item_id);
          // });
        });
      });
    });
  }

  editedLedger: any = null;
  editedAmount: number | null = null;

  setLedgerToEdit(ledger: any) {
    this.editedLedger = ledger;
    this.editedAmount = ledger.amount;
  }

  cancelEdit() {
    this.editedLedger = null;
    this.editedAmount = null;
  }

  ledgerToEdit: any = {}
  updateLedger() {
    this.data.getLedgerByID(this.editedLedger.ledgerId).subscribe((res: any) => {
      this.ledgerToEdit = res;
      this.ledgerToEdit.amountCredit = this.editedLedger.amount;
      
      this.data.updateLedgerById(this.ledgerToEdit).subscribe((res) => {
        this.updateReservationLedger(res);
      });
    });
  }

  updateReservationLedger(res: any) {  
      this.data.updateReservationLedgerById(this.editedLedger).subscribe((res) => {
        let requestBody = {
          id: this.editedLedger.booking_id,
          paymentToAdd: this.editedLedger.amount - this.originalAmount,
        }
    
        this.data.addReservationPayment(requestBody).subscribe((res: any) => {
          window.location.reload();
          });
        });
    }

  originalAmount: number = 0;

  saveEdit() {
    if (this.editedLedger) {
      this.originalAmount = this.editedLedger.amount;
      this.editedLedger.amount = this.editedAmount;
      this.updateLedger();
    }
  }


}
