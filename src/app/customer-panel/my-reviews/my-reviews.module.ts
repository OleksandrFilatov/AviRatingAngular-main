import { SharedModule } from 'src/app/website/shared/shared.module'
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyReviewsComponent } from './my-reviews.component';
import { CustomerSharedModule } from '../customer-shared/customer-shared.module'
import { RouterModule } from '@angular/router'

import { DataService } from './data.service'

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        CustomerSharedModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '', component: MyReviewsComponent,

            }
        ])
    ],
    declarations: [MyReviewsComponent],
    providers: [DataService]
})
export class MyReviewsModule { }
