import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketPagesRoutingModule } from './ticket-pages-routing.module';
import { TicketPagesComponent } from './ticket-pages.component';


@NgModule({
  declarations: [
    TicketPagesComponent
  ],
  imports: [
    CommonModule,
    TicketPagesRoutingModule
  ]
})
export class TicketPagesModule { }
