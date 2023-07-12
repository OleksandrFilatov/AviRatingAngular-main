import { BusinessOwnerSharedModule } from './../business-owner-shared/business-owner-shared.module'
import { NgModule } from '@angular/core'
import { ListingComponent } from './listing.component'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'

@NgModule({
    imports: [
        BusinessOwnerSharedModule,
        ModalModule.forRoot(),
        RouterModule.forChild([
            { path: '', component: ListingComponent }
        ])
    ],
    declarations: [ListingComponent],
    providers: [DataService]

})
export class ListingModule { }
