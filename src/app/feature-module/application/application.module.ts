import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ApplicationComponent],
  imports: [CommonModule, ApplicationRoutingModule, SharedModule],
})
export class ApplicationModule {}
