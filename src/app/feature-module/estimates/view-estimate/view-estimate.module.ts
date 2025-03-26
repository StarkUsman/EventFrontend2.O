import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEstimateComponent } from './view-estimate.component';
import { ViewEstimateRoutingModule } from './view-estimate-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [ViewEstimateComponent],
  imports: [CommonModule, ViewEstimateRoutingModule, SharedModule, MatAutocompleteModule]
})
export class ViewEstimateModule {}
