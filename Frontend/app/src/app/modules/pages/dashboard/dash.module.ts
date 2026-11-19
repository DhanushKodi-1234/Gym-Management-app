import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import{DashboardRoutingModule} from './dashboard.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import{DashComponent} from './dash/dash.component';
@NgModule({
  declarations: [
    DashComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule
  ]
})
export class DashModule { }
