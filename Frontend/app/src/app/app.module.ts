import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import{provideHttpClient} from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UiElementsModule } from './modules/ui-elements/ui-elements.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    UiElementsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }