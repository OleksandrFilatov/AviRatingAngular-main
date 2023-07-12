import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusinessOwnerSharedModule } from './../business-owner-shared/business-owner-shared.module'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannersComponent } from './banners.component';
import { RouterModule } from '@angular/router';
import { DataService } from './data.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ImageCropperModule } from 'ngx-image-cropper'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'




@NgModule({
  imports: [
    BusinessOwnerSharedModule,
    FormsModule,
    ImageCropperModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild([
        { path: '', component: BannersComponent }
    ])
  ],
  declarations: [BannersComponent],
  providers: [DataService ]
})
export class BannersModule { }
