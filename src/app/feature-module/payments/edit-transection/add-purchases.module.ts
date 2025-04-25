import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPurchasesRoutingModule } from './add-purchases-routing.module';
import { AddPurchasesComponent } from './add-purchases.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    AddPurchasesComponent
  ],
  imports: [
    CommonModule,
    AddPurchasesRoutingModule,
    SharedModule,
    MatAutocompleteModule
  ]
})
export class AddPurchasesModule { }
