import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundlayoutComponent } from './notfoundlayout/notfoundlayout.component';

import { NotfoundlayoutRoutingModule } from './notfoundlayout.routing.module';

@NgModule({
  declarations: [
    NotfoundlayoutComponent
  ],
  imports: [
    CommonModule,
    NotfoundlayoutRoutingModule
  ]
})
export class NotfoundlayoutModule { }
