import { NgModule } from '@angular/core'
import { RegionsComponent } from './regions.component'
import { RouterModule } from '@angular/router'
import { ModalModule } from 'ngx-bootstrap/modal'
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { DataService } from './data.service'

@NgModule({
  imports: [
    AdminSharedModule,
    SharedModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: RegionsComponent }
  ])
  ],
  declarations: [RegionsComponent],
  providers: [ DataService ]

})
export class RegionsModule { }
