import { ImageCropperModule } from 'ngx-image-cropper';
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { SharedModule } from './../../website/shared/shared.module'
import { AdminSharedModule } from './../admin-shared/admin-shared.module'
import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BusinessCategoriesComponent } from './business-categories.component'

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    SharedModule,
    ModalModule.forChild(),
    ReactiveFormsModule,
    ImageCropperModule,
    RouterModule.forChild([
      {path:'', component:BusinessCategoriesComponent}
    ])
  ],
  declarations: [BusinessCategoriesComponent],
  providers: [DataService]
})  
export class BusinessCategoriesModule { }
