import { apis } from 'src/environments/environment'
import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core'
import { ProfileComponent } from './profile.component'
import { ModalModule } from 'ngx-bootstrap/modal'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { PopoverModule } from 'ngx-bootstrap/popover'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { ImageCropperModule } from 'ngx-image-cropper'
import { RouterModule } from '@angular/router'
import { NgScrollbarModule } from 'ngx-scrollbar'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { CustomerSharedModule } from '../customer-shared/customer-shared.module'
import { NgSelect2Module } from 'ng-select2';

@NgModule({
    imports: [
        NgSelect2Module,
        CustomerSharedModule,
        SharedModule,
        FormsModule,
        NgScrollbarModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDatepickerModule.forRoot(),
        ReactiveFormsModule,
        ImageCropperModule,
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),
        RouterModule.forChild([
            { path: '', component: ProfileComponent }
        ])
    ],
    declarations: [ProfileComponent],
})
export class ProfileModule { }
