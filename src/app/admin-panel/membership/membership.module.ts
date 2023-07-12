import { ImageCropperModule } from 'ngx-image-cropper';
import { DataService } from './data.service';
import { Router, RouterModule } from '@angular/router'
import { ModalModule } from 'ngx-bootstrap/modal'
import { ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from './../../website/shared/shared.module'
import { AdminSharedModule } from './../admin-shared/admin-shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MembershipComponent } from './membership.component'

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    SharedModule,
    ModalModule.forChild(),
    ReactiveFormsModule,
    ImageCropperModule,
    RouterModule.forChild([
      {path:'', component:MembershipComponent}
    ])
  ],
  declarations: [MembershipComponent],
  providers:[DataService]
})
export class MembershipModule { }
