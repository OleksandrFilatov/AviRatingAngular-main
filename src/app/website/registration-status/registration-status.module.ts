import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationStatusComponent } from './registration-status.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:'', component: RegistrationStatusComponent}
    ])
  ],
  declarations: [RegistrationStatusComponent]
})
export class RegistrationStatusModule { }
