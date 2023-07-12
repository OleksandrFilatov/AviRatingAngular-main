import { DataService } from './data.service';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal'
import { ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from './../../website/shared/shared.module'
import { AdminSharedModule } from './../admin-shared/admin-shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ContactUsComponent } from './contact-us.component'


@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    SharedModule,
    ModalModule.forChild(),
    ReactiveFormsModule,
    RouterModule.forChild([
      {path:'', component:ContactUsComponent}
    ])
  ],
  declarations: [ContactUsComponent],
  providers:[DataService]
})
export class ContactUsModule { }
