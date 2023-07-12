import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditListingComponent } from './add-edit-listing.component';
import { BusinessOwnerSharedModule } from '../business-owner-shared/business-owner-shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LazyLoadImageModule } from 'ng-lazyload-image'
import { ImageCropperModule } from 'ngx-image-cropper'
import { RouterModule } from '@angular/router';
import { AddImagesComponent } from './add-images/add-images.component';
import { NgScrollbarModule } from 'ngx-scrollbar'
import { DataService } from './data.service';



@NgModule({
    imports: [
        BusinessOwnerSharedModule,
        ReactiveFormsModule,
        FormsModule,
        LazyLoadImageModule,
        ModalModule.forRoot(),
        ImageCropperModule,
        NgScrollbarModule,
        RouterModule.forChild([
            { path: '', component: AddEditListingComponent }
        ])
    ],
    declarations: [AddEditListingComponent, AddImagesComponent],
    providers: [DataService]
})
export class AddEditListingModule { }
