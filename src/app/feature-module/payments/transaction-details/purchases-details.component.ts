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
  // purchaseToView: any;
  transactionToView: any = {
    trans_id: null,
    date: null,
    amount: null,
    chequeNumber: null,
    creditAccount: null,
    debitAccount: null,
    notes: null,
    voucher: null,
    img: null,
  };

  constructor(private route: ActivatedRoute, private data: DataService) { }

  ngOnInit(): void {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    this.route.queryParams.subscribe(params => {
      let id = params['id'];
      this.data.getTransactionById(id).subscribe((res: any) => {
        res.date = new Date(res.date).toLocaleString('en-US', options);
        this.transactionToView = res;
        console.log(res);
        // this.payment.purchaseId = this.purchaseToView.id;
        // this.payment.amount = this.purchaseToView.total_amount;
        // this.paymentStatus = this.purchaseToView.status==="Pending" ? "Unpaid" : "Paid";
      });
    });
  }

}
