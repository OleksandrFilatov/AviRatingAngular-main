import { LazyLoadImageModule } from 'ng-lazyload-image'
import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { BusinessProfileComponent } from './business-profile.component'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared/shared.module'
import { ReactiveFormsModule } from '@angular/forms'
import { IRatingModule } from 'src/app/libs/irating/irating.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { LightboxModule } from 'ngx-lightbox'

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        IRatingModule,
        LightboxModule,
        LazyLoadImageModule,
        ModalModule.forRoot(),
        RouterModule.forChild([
            { path: '', component: BusinessProfileComponent }
        ])
    ],
    declarations: [BusinessProfileComponent],
    providers: [DataService]
})
export class BusinessProfileModule { }
