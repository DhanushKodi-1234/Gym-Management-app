import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { OverallComponent } from './components/overall/overall.component';
import { SignupComponent } from './components/signup/signup.component'; 
import { SuperadminComponent } from './components/superadmin/superadmin.component';

@NgModule({
  declarations: [
    LoginComponent,
    OverallComponent,
    SignupComponent,
    SuperadminComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class AuthModule { }
