import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from './../../website/shared/shared.module'
import { RegistrationComponent } from './registration.component'
import { Routes, RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { ImageCropperModule } from 'ngx-image-cropper'
import { NgScrollbarModule } from 'ngx-scrollbar'
import { TimepickerModule } from 'ngx-bootstrap/timepicker'
import { ModalModule } from 'ngx-bootstrap/modal'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { PopoverModule } from 'ngx-bootstrap/popover'
import { TermsAndConditionsModule } from '../terms-and-conditions/terms-and-conditions.module'
import { AgmCoreModule } from '@agm/core'
import { apis } from 'src/environments/environment'
import { NgSelect2Module } from 'ng-select2';

const routes: Routes = [
    { path: '', component: RegistrationComponent }
]
@NgModule({
    imports: [
        NgSelect2Module,
        CommonModule,
        FormsModule,
        SharedModule,
        PopoverModule.forRoot(),
        NgScrollbarModule,
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        ModalModule.forRoot(),
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        ImageCropperModule,
        TermsAndConditionsModule,
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),
    ],
    declarations: [RegistrationComponent],
    exports: [RouterModule],
})
export class RegistrationModule { }
