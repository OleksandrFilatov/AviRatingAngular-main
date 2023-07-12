import { NgModule } from '@angular/core'
import { ListingsComponent } from './listings.component'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
@NgModule({
  imports: [
    AdminSharedModule,
    AutocompleteLibModule,
    SharedModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: ListingsComponent }
    ])
    ],
  declarations: [ListingsComponent],
  providers: [ DataService ]
})
export class ListingsModule { }
