import { NgModule } from '@angular/core'
import { ViewCustomerComponent } from './view-customer.component'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { ImageCropperModule } from 'ngx-image-cropper'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'

@NgModule({
  imports: [
    AdminSharedModule,
    SharedModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ImageCropperModule,
    RouterModule.forChild([
      { path: '', component: ViewCustomerComponent }
  ])
  ],
  declarations: [ViewCustomerComponent],
  providers: [ DataService ]
})
export class ViewCustomerComponentModule { }
