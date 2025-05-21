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

  // printInvoice() {
  //   const printContents = document.querySelector('.card')?.innerHTML;
  //   if (!printContents) return;

  //   const printWindow = window.open('', '', 'width=1000,height=800');
  //   if (!printWindow) return;

  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Print Reservation</title>
  //         <style>
  //           body {
  //             font-family: Arial, sans-serif;
  //             padding: 20px;
  //           }
  //           table {
  //             width: 100%;
  //             border-collapse: collapse;
  //           }
  //           th, td {
  //             border: 1px solid #ddd;
  //             padding: 8px;
  //           }
  //           th {
  //             background-color: #f4f4f4;
  //           }
  //           h5, p {
  //             margin: 0;
  //             padding: 5px 0;
  //           }
  //           .text-center { text-align: center; }
  //           .text-start { text-align: left; }
  //           .text-success { color: green; }
  //           .text-danger { color: red; }
  //         </style>
  //       </head>
  //       <body onload="window.print(); window.close();">
  //         ${printContents}
  //       </body>
  //     </html>
  //   `);

  //   printWindow.document.close();
  // }

  printInvoice() {
  const originalContent = document.querySelector('.card');
  if (!originalContent) return;

  const clone = originalContent.cloneNode(true) as HTMLElement;

  // Fix logo image
  const logoImg = clone.querySelector('img[alt="logo"]') as HTMLImageElement;
  if (logoImg) {
    const isBase64 = this.companySettings.logo?.startsWith('data:image/');
    const imageSrc = isBase64
      ? this.companySettings.logo
      : `${window.location.origin}/assets/img/newLogo2.png`;

    logoImg.setAttribute('src', imageSrc);
    logoImg.removeAttribute('[src]');
  }

  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Invoice</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
          body { padding: 20px; font-family: Arial, sans-serif; }
          .invoice-logo img { max-width: 150px; }
          .table th, .table td { padding: 8px; }
        </style>
      </head>
      <body></body>
    </html>
  `);

  printWindow.document.close();

  // Wait until document is ready
  printWindow.onload = () => {
    printWindow.document.body.appendChild(clone);
    printWindow.focus();
    printWindow.print();
    setTimeout(() => printWindow.close(), 500);
  };
}


}
