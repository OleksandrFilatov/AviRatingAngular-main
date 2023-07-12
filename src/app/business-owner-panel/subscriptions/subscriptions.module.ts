import { SharedModule } from './../../website/shared/shared.module';
import { BusinessOwnerSharedModule } from './../business-owner-shared/business-owner-shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsComponent } from './subscriptions.component';
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { ModalModule } from 'ngx-bootstrap/modal'

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        BusinessOwnerSharedModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        RouterModule.forChild([
            {
                path: '', component: SubscriptionsComponent,

            }
        ])
    ],
    declarations: [SubscriptionsComponent],
    providers: [DataService]
})
export class SubscriptionsModule { }
