import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:'', component: PrivacyPolicyComponent}
    ])
  ],
  declarations: [PrivacyPolicyComponent]
})
export class PrivacyPolicyModule { }
