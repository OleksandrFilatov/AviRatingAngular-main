import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CustomerGuard } from '../auth/customer-guard'
import { CustomerPanelComponent } from './customer-panel.component'

const routes: Routes = [
    {
        path: '',
        component: CustomerPanelComponent,
        canActivate: [CustomerGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./customer-dashboard/customer-dashboard.module')
                    .then(mod => mod.CustomerDashboardModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module')
                    .then(mod => mod.ProfileModule)
            },
            {
                path: 'change-password',
                loadChildren: () => import('./change-password/change-password.module')
                    .then(mod => mod.ChangePasswordModule)
            },
            {
                path: 'my-listing-reviews',
                loadChildren: () => import('./my-reviews/my-reviews.module')
                    .then(mod => mod.MyReviewsModule)
            },
            {
                path: 'my-business-reviews',
                loadChildren: () => import('./my-business-reviews/my-business-reviews.module')
                    .then(mod => mod.MyBusinessReviewsModule)
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerPanelRoutes { }
