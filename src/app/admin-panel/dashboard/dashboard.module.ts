import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { DashboardComponent } from './dashboard.component'

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: DashboardComponent }
        ])
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule { }
