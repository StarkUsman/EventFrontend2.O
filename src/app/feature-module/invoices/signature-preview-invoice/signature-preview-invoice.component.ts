import { Component } from '@angular/core';
import { routes } from 'src/app/core/helpers/routes/routes';

@Component({
  selector: 'app-signature-preview-invoice',
  templateUrl: './signature-preview-invoice.component.html',
  styleUrls: ['./signature-preview-invoice.component.scss']
})
export class SignaturePreviewInvoiceComponent {
  public routes = routes

}
