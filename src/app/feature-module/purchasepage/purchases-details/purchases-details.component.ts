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
  purchaseToView: any;
  payment: any = {
    purchaseId: null,
    method: "cash",
    amount: null,
    chequeNumber: null,
    cardNumber: null,
    expiryDate: null,
    cvv: null,
    paymentCode: null,
  };
  paymentStatus: any = null
  companySettings: any = {};

  constructor(private route: ActivatedRoute, private data: DataService) { }

  ngOnInit(): void {
    this.companySettings = JSON.parse(localStorage.getItem('companySettings') || '{}');
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    this.route.queryParams.subscribe(params => {
      let id = params['id'];
      this.data.getPurchaseById(id).subscribe((res: any) => {
        res.purchase_date = new Date(res.purchase_date).toLocaleString('en-US', options);
        res.due_date = new Date(res.due_date).toLocaleString('en-US', options);
        this.purchaseToView = res;
        this.purchaseToView.remainingDays = Math.floor((new Date(this.purchaseToView.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        this.purchaseToView.totalTerm = Math.floor((new Date(this.purchaseToView.due_date).getTime() - new Date(this.purchaseToView.purchase_date).getTime()) / (1000 * 60 * 60 * 24));
        console.log(res);
        this.payment.purchaseId = this.purchaseToView.id;
        this.payment.amount = this.purchaseToView.total_amount;
        this.paymentStatus = this.purchaseToView.status==="Pending" ? "Unpaid" : "Paid";
      });
    });
  }


  setPaymentMethod(method: string) {
    this.payment.method = method;
  }

  processPayment() {
    // cash method
    if (this.payment.method === "cash") {
      this.payment.chequeNumber = null;
      this.payment.cardNumber = null;
      this.payment.expiryDate = null;
      this.payment.cvv = null;
      this.payment.paymentCode = "CPV";
    } else if (this.payment.method === "cheque") {
      this.payment.cardNumber = null;
      this.payment.expiryDate = null;
      this.payment.cvv = null;
      this.payment.paymentCode = "BPV";
    } else if (this.payment.method === "card") {
      this.payment.chequeNumber = null;
      this.payment.paymentCode = "BPV";
    }

    const ledger = {
      name: this.payment.paymentCode,
      purch_id: this.purchaseToView.id,
      vendor_id: this.purchaseToView.vendor.id,
      amountCredit: this.purchaseToView.total_amount
    }

    this.data.addLedger(ledger).subscribe((res) => { });
    this.data.updatePurchaseStatus(this.purchaseToView.id, "Paid").subscribe((res) => {});
    //reload page
    window.location.reload();
  }

}
