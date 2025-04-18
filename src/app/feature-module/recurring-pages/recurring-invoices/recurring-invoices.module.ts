import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecurringInvoicesRoutingModule } from './recurring-invoices-routing.module';
import { RecurringInvoicesComponent } from './recurring-invoices.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';




@NgModule({
  declarations: [
    RecurringInvoicesComponent
  ],
  imports: [
    CommonModule,
    RecurringInvoicesRoutingModule,
    SharedModule,
    MatAutocompleteModule
 
  ]
})
export class RecurringInvoicesModule { }
