import { SidebarComponent } from './sidebar/sidebar.component'
import { ModalModule } from 'ngx-bootstrap/modal'
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar'
import { NgModule } from '@angular/core'
import { BusinessOwnerPanelRoutes } from './business-owner-panel.routing'
import { BusinessOwnerPanelComponent } from './business-owner-panel.component'
import { LayoutModule } from './layout/layout.module'
import { BusinessOwnerSharedModule } from './business-owner-shared/business-owner-shared.module'

@NgModule({
    imports: [
        ModalModule.forRoot(),
        BusinessOwnerSharedModule,
        LayoutModule,
        BusinessOwnerPanelRoutes,
        NgScrollbarModule
    ],
    providers: [
        {
            provide: NG_SCROLLBAR_OPTIONS,
            useValue: {
            }
        }
    ],
    declarations: [BusinessOwnerPanelComponent, SidebarComponent],
    entryComponents: []
})
export class BusinessOwnerPanelModule { }
