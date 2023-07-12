import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { SharedModule } from './../../website/shared/shared.module';
import { AdminSharedModule } from './../admin-shared/admin-shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BusinessClaimsComponent } from './business-claims.component'

@NgModule({
  imports: [
    AdminSharedModule,
    SharedModule,
    ModalModule.forChild(),
    ReactiveFormsModule,
    RouterModule.forChild([
      {path:'', component:BusinessClaimsComponent}
    ])
  ],
  providers:[DataService],
  declarations: [BusinessClaimsComponent]
})
export class BusinessClaimsModule { }
