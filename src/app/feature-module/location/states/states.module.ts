import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatesRoutingModule } from './states-routing.module';
import { StatesComponent } from './states.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    StatesComponent
  ],
  imports: [
    CommonModule,
    StatesRoutingModule,
    SharedModule,
    MatAutocompleteModule
  ]
})
export class StatesModule { }
