import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplayoutComponent } from './applayout/applayout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ApplayoutRoutingModule } from './applayout.routing.module';

@NgModule({
  declarations: [ApplayoutComponent, HeaderComponent, FooterComponent, NavbarComponent],
  imports: [
    CommonModule,
    FormsModule,
    ApplayoutRoutingModule
  ],
  exports: [ApplayoutComponent, HeaderComponent, FooterComponent, NavbarComponent]
})
export class ApplayoutModule { }
