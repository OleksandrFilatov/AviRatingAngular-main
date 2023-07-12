import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { AdminModule } from './../admin/admin.module'
import { AdminSharedModule } from './../admin-shared/admin-shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AmenitiesComponent } from './amenities.component'
import { createComponent } from '@angular/compiler/src/core'

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    SharedModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild([
      {path:'', component: AmenitiesComponent} 
    ]),
    CommonModule
  ],
  declarations: [AmenitiesComponent],
  providers:[DataService]
})
export class AmenitiesModule { }
