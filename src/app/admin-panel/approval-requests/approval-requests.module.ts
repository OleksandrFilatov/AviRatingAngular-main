import { AdminSharedModule } from './../admin-shared/admin-shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ApprovalRequestsComponent } from './approval-requests.component'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { ModalModule } from 'ngx-bootstrap/modal'

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    ModalModule.forRoot(),
    RouterModule.forChild([
        { path: '', component: ApprovalRequestsComponent }
      ])
  ],
  declarations: [ApprovalRequestsComponent],
  providers: [ DataService ]
})
export class ApprovalRequestsModule { }
