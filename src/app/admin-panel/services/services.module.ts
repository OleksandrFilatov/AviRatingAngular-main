import { DataService } from './data.service'
import { ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { AdminSharedModule } from './../admin-shared/admin-shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ServicesComponent } from './services.component'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    SharedModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: ServicesComponent }
  ])
  ],
  declarations: [ServicesComponent],
  providers: [ DataService ]
})
export class ServicesModule { }
