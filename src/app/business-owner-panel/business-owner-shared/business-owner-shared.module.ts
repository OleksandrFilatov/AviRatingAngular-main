import { IAlertsModule } from 'src/app/libs/ialert/ialerts.module';
import { NoDataComponent } from './no-data/no-data.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { ResponseComponent } from './response/response.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { NgScrollbarModule } from 'ngx-scrollbar'

@NgModule({
    imports: [
        IAlertsModule,
        BsDropdownModule.forRoot(),
        CommonModule, FormsModule, RouterModule, NgScrollbarModule,
    ],
    declarations: [
        ResponseComponent,
        PageNotFoundComponent,
        NoDataComponent
    ],
    exports: [
        NoDataComponent,
        CommonModule, ResponseComponent, PageNotFoundComponent, IAlertsModule,
    ]
})
export class BusinessOwnerSharedModule { }
