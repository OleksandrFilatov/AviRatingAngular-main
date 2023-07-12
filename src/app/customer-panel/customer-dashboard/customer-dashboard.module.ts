import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import {CustomerDashboardComponent } from './customer-dashboard.component'
import { CustomerSharedModule } from '../customer-shared/customer-shared.module'

@NgModule({
    imports: [
        CustomerSharedModule,
        RouterModule.forChild([
            { path: '', component: CustomerDashboardComponent }
        ])
    ],
    declarations: [CustomerDashboardComponent]
})
export class CustomerDashboardModule { }
