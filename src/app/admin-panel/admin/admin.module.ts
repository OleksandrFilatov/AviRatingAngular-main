import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/website/shared/shared.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule} from 'ngx-bootstrap/modal';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminRegistrationComponent } from './admin-registration/admin-registration.component';

@NgModule({
    imports: [
    AdminSharedModule,
        SharedModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', component: AdminListComponent }
        ])
    ],
    declarations: [AdminListComponent, AdminRegistrationComponent]
})
export class AdminModule { }
