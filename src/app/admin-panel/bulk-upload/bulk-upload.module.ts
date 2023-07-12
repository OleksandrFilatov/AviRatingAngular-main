import { NgModule } from '@angular/core'
import { BulkUploadComponent } from './bulk-upload.component'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { ModalModule } from 'ngx-bootstrap/modal'

@NgModule({
  imports: [
    AdminSharedModule,
    SharedModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild([
      { path: '', component: BulkUploadComponent }
  ])
  ],
  declarations: [BulkUploadComponent],
  providers: [DataService]
})
export class BulkUploadModule { }
