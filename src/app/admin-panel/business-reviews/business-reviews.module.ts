import { NgModule } from '@angular/core'
import { BusinessReviewsComponent } from './business-reviews.component'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { RouterModule } from '@angular/router'
import { SubjectsComponent } from '../subjects/subjects.component'
import { DataService } from './data.service'
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LightboxModule } from 'ngx-lightbox'



@NgModule({
  imports: [
    AdminSharedModule,
    SharedModule,
    LightboxModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    RouterModule.forChild([
      { path: '', component: BusinessReviewsComponent }
  ])
  ],
  declarations: [BusinessReviewsComponent],
  providers: [DataService]
})
export class BusinessReviewsModule { }
