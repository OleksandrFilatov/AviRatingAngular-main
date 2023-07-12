import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PaymentHistoryComponent } from './payment-history.component'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'

@NgModule({
    imports: [
        CommonModule,
        AdminSharedModule,
        SharedModule,
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', component: PaymentHistoryComponent }
        ])
    ],
    declarations: [PaymentHistoryComponent],
    providers: [DataService]
})
export class PaymentHistoryModule { }
