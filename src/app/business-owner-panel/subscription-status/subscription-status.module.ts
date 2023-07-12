import { ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { subscriptionStatusComponent } from './subscription-status.component'
import { RouterModule } from '@angular/router'

import { BusinessOwnerSharedModule } from '../business-owner-shared/business-owner-shared.module'

@NgModule({
  imports: [
    CommonModule,
    BusinessOwnerSharedModule,
    
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: subscriptionStatusComponent }
  ])
  ],
  providers: [ ],
  declarations: [subscriptionStatusComponent]
})
export class subscriptionStatusModule { }
