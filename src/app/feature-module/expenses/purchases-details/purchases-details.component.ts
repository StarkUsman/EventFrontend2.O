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
      this.data.getExpenseByID(id).subscribe((res: any) => {
        res.purchase_date = new Date(res.purchase_date).toLocaleString('en-US', options);
        this.purchaseToView = res;
        this.payment.purchaseId = this.purchaseToView.id;
        this.payment.amount = this.purchaseToView.total_amount;
      });
    });
  }

}
