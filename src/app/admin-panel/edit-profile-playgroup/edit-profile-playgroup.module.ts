import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfilePlaygroupComponent } from './edit-profile-playgroup.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/website/shared/shared.module';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DataService } from './data.service'

@NgModule({
  imports: [
    AdminSharedModule,
    SharedModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    ImageCropperModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild([
      { path: '', component: EditProfilePlaygroupComponent }
  ])
  ],
  declarations: [EditProfilePlaygroupComponent],
  providers: [DataService]
})
export class EditProfilePlaygroupModule { }
