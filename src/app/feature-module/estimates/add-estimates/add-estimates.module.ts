import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEstimatesComponent } from './add-estimates.component';
import { AddstimatesRoutingModule } from './add-estimates-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [AddEstimatesComponent],
  imports: [CommonModule, AddstimatesRoutingModule, SharedModule, MatAutocompleteModule],
})
export class AddEstimatesModule {}
