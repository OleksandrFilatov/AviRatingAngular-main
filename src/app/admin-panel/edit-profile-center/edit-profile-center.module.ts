import { NgModule } from '@angular/core'
import { EditProfileCenterComponent } from './edit-profile-center.component'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
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
      { path: '', component: EditProfileCenterComponent }
  ])
  ],
  declarations: [EditProfileCenterComponent],
  providers: [ DataService ]
})
export class EditProfileCenterModule { }
