import { ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { bannersSstatusComponent } from './banners-status.component'
import { RouterModule } from '@angular/router'

import { BusinessOwnerSharedModule } from '../business-owner-shared/business-owner-shared.module'

@NgModule({
  imports: [
    CommonModule,
    BusinessOwnerSharedModule,
    
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: bannersSstatusComponent }
  ])
  ],
  providers: [ ],
  declarations: [bannersSstatusComponent]
})
export class BannersSstatusModule { }
