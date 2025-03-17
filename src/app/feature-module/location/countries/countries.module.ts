import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountriesRoutingModule } from './countries-routing.module';
import { CountriesComponent } from './countries.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    CountriesComponent
  ],
  imports: [
    CommonModule,
    CountriesRoutingModule,
    MatAutocompleteModule,
    SharedModule
  ]
})
export class CountriesModule { }
