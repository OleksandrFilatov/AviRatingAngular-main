import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BusinessTypesComponent } from './business-types.component'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'

@NgModule({
    imports: [
        CommonModule,
        AdminSharedModule,
        SharedModule,
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', component: BusinessTypesComponent }
        ])
    ],
    declarations: [BusinessTypesComponent],
    providers: [DataService]
})

export class BusinessTypesModule { }

