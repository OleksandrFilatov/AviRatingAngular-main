import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BusinessOwnerPanelComponent } from './business-owner-panel.component'
import { BusinessOwnerGuard } from '../auth/business-owner-guard'

const routes: Routes = [
    {
        path: '',
        component: BusinessOwnerPanelComponent,
        canActivate: [BusinessOwnerGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./business-owner-dashboard/business-owner-dashboard.module')
                    .then(mod => mod.BusinessOwnerDashboardModule)
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
            }, {
                path: 'listing/edit/:id',
                loadChildren: () => import('./add-edit-listing/add-edit-listing.module')
                    .then(mod => mod.AddEditListingModule)
            },
            {
                path: 'listing/add/:id',
                loadChildren: () => import('./add-edit-listing/add-edit-listing.module')
                    .then(mod => mod.AddEditListingModule)
            },
            {
                path: 'listing/list',
                loadChildren: () => import('./listing/listing.module')
                    .then(mod => mod.ListingModule)
            },
            {
                path: 'subscriptions',
                loadChildren: () => import('./subscriptions/subscriptions.module')
                    .then(mod => mod.SubscriptionsModule)
            },
            {
                path: 'replies',
                loadChildren: () => import('./available-replies/available-replies.module')
                    .then(mod => mod.AvailableRepliesModule)
            },
            {
                path: 'banners',
                loadChildren: () => import('./banners/banners.module')
                    .then(mod => mod.BannersModule)
            },
            {
                path: 'banners-status/:status',
                loadChildren: () =>
                    import('./banners-status/banners-status.module').then(
                        mod => mod.BannersSstatusModule
                    )
            },
            {
                path: 'subscription-status/:status/:name',
                loadChildren: () =>
                    import('./subscription-status/subscription-status.module').then(
                        mod => mod.subscriptionStatusModule
                    )
            },
            {
                path: 'reply-status/:status',
                loadChildren: () => import('../business-owner-panel/reply-payment-status/reply-payment-status.module')
                    .then(mod => mod.ReplyPaymentStatusModule)
            },
            {
                path: 'my-business-reviews',
                loadChildren: () =>
                    import('./my-business-reviews/my-business-reviews.module').then(
                        mod => mod.MyBusinessReviewsModule
                    )
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BusinessOwnerPanelRoutes { }
