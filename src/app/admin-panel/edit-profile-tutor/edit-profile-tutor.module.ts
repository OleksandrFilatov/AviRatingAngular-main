import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileTutorComponent } from './edit-profile-tutor.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/website/shared/shared.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule} from 'ngx-bootstrap/modal';
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
    ReactiveFormsModule,
    ImageCropperModule,
    RouterModule.forChild([
        { path: '', component: EditProfileTutorComponent }
    ])
  ],
  declarations: [EditProfileTutorComponent],
  providers: [ DataService ]
})
export class EditProfileTutorModule { }
