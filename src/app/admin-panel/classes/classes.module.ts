import { NgModule } from '@angular/core'
import { ClassesComponent } from './classes.component'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { ImageCropperModule } from 'ngx-image-cropper'
import { DataService } from './data.service'

@NgModule({
  imports: [
    AdminSharedModule,
    SharedModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    ImageCropperModule,
    RouterModule.forChild([
      { path: '', component: ClassesComponent }
  ])
  ],
  declarations: [ClassesComponent],
  providers: [ DataService ]
})
export class ClassesModule { }
