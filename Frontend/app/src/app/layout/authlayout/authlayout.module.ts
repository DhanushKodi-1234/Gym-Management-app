import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthlayoutComponent } from './authlayout/authlayout.component';
import { AuthlayoutRoutingModule } from './authlayout.routing.module';

@NgModule({
  declarations: [AuthlayoutComponent],
  imports: [
    CommonModule,
    AuthlayoutRoutingModule
   
  ]
})
export class AuthlayoutModule { }
