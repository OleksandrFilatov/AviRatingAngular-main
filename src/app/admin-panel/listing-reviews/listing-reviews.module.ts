import { NgModule } from '@angular/core'
import { ListingReviewsComponent } from './listing-reviews.component'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { RouterModule } from '@angular/router'
import { SubjectsComponent } from '../subjects/subjects.component'
import { DataService } from './data.service'
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';



@NgModule({
  imports: [
    AdminSharedModule,
    SharedModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    RouterModule.forChild([
      { path: '', component: ListingReviewsComponent }
  ])
  ],
  declarations: [ListingReviewsComponent],
  providers: [DataService]
})
export class ListingReviewsModule { }
