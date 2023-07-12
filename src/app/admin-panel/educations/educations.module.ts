import { NgModule } from '@angular/core'
import { EducationsComponent } from './educations.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'

@NgModule({
  imports: [
    AdminSharedModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild([
        {
            path: '', component: EducationsComponent
        }
    ])
  ],
  declarations: [EducationsComponent],
  providers: [ DataService ]
})
export class EducationsModule { }
