import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { OverallComponent } from './components/overall/overall.component';
import { SignupComponent } from './components/signup/signup.component'; 
import { SuperadminComponent } from './components/superadmin/superadmin.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'overall',
    pathMatch: 'full'
  },
  {
    path: 'overall',
    component: OverallComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'superadmin',
    component: SuperadminComponent
  },
  {
    path: 'admin',
    redirectTo: 'superadmin',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }