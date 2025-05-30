import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditPurchasesRoutingModule } from './edit-purchases-routing.module';
import { EditPurchasesComponent } from './edit-purchases.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    EditPurchasesComponent
  ],
  imports: [
    CommonModule,
    EditPurchasesRoutingModule,
    SharedModule,
    MatAutocompleteModule
  ]
})
export class EditPurchasesModule { }
