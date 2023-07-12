import { ModalModule } from 'ngx-bootstrap/modal'
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar'
import { NgModule } from '@angular/core'
import { CustomerPanelRoutes } from './customer-panel.routing'
import { CustomerPanelComponent } from './customer-panel.component'
import { LayoutModule } from './layout/layout.module';
import { CustomerSharedModule } from './customer-shared/customer-shared.module'
import { SidebarComponent } from './sidebar/sidebar.component'

@NgModule({
    imports: [
        ModalModule.forRoot(),
        CustomerSharedModule,
        LayoutModule,
        CustomerPanelRoutes,
        NgScrollbarModule
    ],
    providers: [
        {
            provide: NG_SCROLLBAR_OPTIONS,
            useValue: {
            }
        }
    ],
    declarations: [CustomerPanelComponent,SidebarComponent],
    entryComponents: []
})
export class CustomerPanelModule { }
