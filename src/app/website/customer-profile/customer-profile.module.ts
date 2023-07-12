import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerProfileComponent } from './customer-profile.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WavesModule, ButtonsModule, InputsModule, IconsModule } from 'angular-bootstrap-md';
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs'

@NgModule({


  imports: [
    WavesModule,
    ButtonsModule,
    InputsModule,
    IconsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TabsModule,
    RouterModule.forChild([
      { path: '', component: CustomerProfileComponent }
    ]),
  ],
  providers: [TabsetConfig],
  declarations: [CustomerProfileComponent],
  bootstrap: [CustomerProfileComponent]
})
export class CustomerProfileModule { }
