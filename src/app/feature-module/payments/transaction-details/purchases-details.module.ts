import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { PurchasesDetailsRoutingModule } from './purchases-details-routing.module';
import { PurchasesDetailsComponent } from './purchases-details.component';


@NgModule({
  declarations: [
    PurchasesDetailsComponent
  ],
  imports: [
    CommonModule,
    PurchasesDetailsRoutingModule,
    SharedModule
  ]
})
export class PurchasesDetailsModule { }
