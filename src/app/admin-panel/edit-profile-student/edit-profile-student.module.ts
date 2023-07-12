import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileStudentComponent } from './edit-profile-student.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/website/shared/shared.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { RouterModule } from '@angular/router';
import { DataService } from './data.service';

@NgModule({
  imports: [
    AdminSharedModule,
    SharedModule,
    NgScrollbarModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    ImageCropperModule,
    RouterModule.forChild([
        { path: '', component: EditProfileStudentComponent }
    ])
  ],
  declarations: [EditProfileStudentComponent],
  providers: [ DataService ]
})
export class EditProfileStudentModule { }
