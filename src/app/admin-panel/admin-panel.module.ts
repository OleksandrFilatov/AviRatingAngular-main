import { SharedModule } from './../website/shared/shared.module';
import { AdminPanelComponent } from './admin-panel.component'
import { AdminSharedModule } from './admin-shared/admin-shared.module'
import { AdminPanelRoutes } from './admin-panel.routing'
import { NgModule } from '@angular/core'

@NgModule({
    imports: [
        AdminSharedModule,
        SharedModule,
        AdminPanelRoutes
    ],
    declarations: [AdminPanelComponent]
})
export class AdminPanelModule { }
