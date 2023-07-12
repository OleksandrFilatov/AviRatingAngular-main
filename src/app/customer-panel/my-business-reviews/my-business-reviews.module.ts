import { SharedModule } from 'src/app/website/shared/shared.module'
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyBusinessReviewsComponent } from './my-business-reviews.component';
import { CustomerSharedModule } from '../customer-shared/customer-shared.module'
import { RouterModule } from '@angular/router'

import { DataService } from './data.service'
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CustomerSharedModule,
        LightboxModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: MyBusinessReviewsComponent,

            }
        ])
    ],
    declarations: [MyBusinessReviewsComponent],
    providers: [DataService]
})
export class MyBusinessReviewsModule { }
