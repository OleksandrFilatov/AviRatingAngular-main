import { apis } from 'src/environments/environment'
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgModule } from '@angular/core'
import { ProfileComponent } from './profile.component'
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { ImageCropperModule } from 'ngx-image-cropper'
import { RouterModule } from '@angular/router'
import { NgScrollbarModule } from 'ngx-scrollbar'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { BusinessOwnerSharedModule } from '../business-owner-shared/business-owner-shared.module'
import { AgmCoreModule } from '@agm/core'

@NgModule({
    imports: [
        BusinessOwnerSharedModule,
        SharedModule,
        FormsModule,
        NgScrollbarModule,
        ModalModule.forRoot(),
        TimepickerModule.forRoot(),
        PopoverModule.forRoot(),
        BsDatepickerModule.forRoot(),
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),
        ImageCropperModule,
        RouterModule.forChild([
            { path: '', component: ProfileComponent }
        ])
    ],
    declarations: [ProfileComponent],
})
export class ProfileModule { }
