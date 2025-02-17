import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { CustomersRoutingModule } from './customers-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [CustomersComponent],
  imports: [CommonModule, CustomersRoutingModule, SharedModule],
})
export class CustomersModule {}
