import { SharedModule } from 'src/app/website/shared/shared.module'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyBusinessReviewsComponent } from './my-business-reviews.component';
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { BusinessOwnerSharedModule } from '../business-owner-shared/business-owner-shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        BusinessOwnerSharedModule,
        ReactiveFormsModule,
        LazyLoadImageModule,
        LightboxModule,
        FormsModule,
        ModalModule.forRoot(),
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
