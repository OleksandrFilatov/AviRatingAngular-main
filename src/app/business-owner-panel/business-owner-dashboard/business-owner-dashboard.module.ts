import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BusinessOwnerDashboardComponent } from './business-owner-dashboard.component'
import { BusinessOwnerSharedModule } from '../business-owner-shared/business-owner-shared.module'

@NgModule({
    imports: [
        BusinessOwnerSharedModule,
        RouterModule.forChild([
            { path: '', component: BusinessOwnerDashboardComponent }
        ])
    ],
    declarations: [BusinessOwnerDashboardComponent]
})
export class BusinessOwnerDashboardModule { }
