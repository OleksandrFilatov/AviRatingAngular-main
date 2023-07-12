import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimStatusComponent } from './claim-status.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:'', component: ClaimStatusComponent}
    ])
  ],
  declarations: [ClaimStatusComponent]
})
export class ClaimStatusModule { }
