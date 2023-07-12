import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component'
import { WebsiteComponent } from './website.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { WebsiteGuard } from '../auth/website-guard'
import { NoAuthGuard } from '../auth/no-auth-guard'

const routes: Routes = [
    {
        path: '',
        component: WebsiteComponent,
        canActivate: [WebsiteGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('./index/index.module')
                    .then(mod => mod.IndexModule)
            },
            {
                path: 'login',
                canActivate: [NoAuthGuard],
                loadChildren: () => import('./login/login.module')
                    .then(mod => mod.LoginModule)
            },
            {
                path: 'registration',
                canActivate: [NoAuthGuard],
                loadChildren: () => import('./registration/registration.module')
                    .then(mod => mod.RegistrationModule)
            },
            {
                path: 'registration/:user_type',
                canActivate: [NoAuthGuard],
                loadChildren: () => import('./registration/registration.module')
                    .then(mod => mod.RegistrationModule)
            },
            {
                path: 'contact-us',
                loadChildren: () => import('./contact-us/contact-us.module')
                    .then(mod => mod.ContactUsModule)
            },
            {
                path: 'airparks',
                loadChildren: () => import('./airparks/airparks.module')
                    .then(mod => mod.AirparksModule)
            },
            {
                path: 'my-posts',
                loadChildren: () => import('./my-posts/my-posts.module')
                    .then(mod => mod.MyPostsModule)
            },
            {
                path: 'notifications',
                loadChildren: () => import('./notifications/notifications.module')
                    .then(mod => mod.NotificationsModule)
            },
            {
                path: 'airport/:airport_id',
                loadChildren: () => import('./airport/airport.module')
                    .then(mod => mod.AirportModule)
            },
            {
                path: 'customer-profile/:customer_id',
                loadChildren: () => import('./customer-profile/customer-profile.module')
                    .then(mod => mod.CustomerProfileModule)
            },
            {
                path: 'create-group',
                loadChildren: () => import('./create-group/create-group.module')
                    .then(mod => mod.CreateGroupModule)
            },
            {
                path: 'group-post/:group_id',
                loadChildren: () => import('./group-post/group-post.module')
                    .then(mod => mod.GroupPostModule)
            },
            {
                path: 'customer-post/:post_id',
                loadChildren: () => import('./customer-post/customer-post.module')
                    .then(mod => mod.CustomerPostModule)
            },
            {
                path: 'about-us',
                loadChildren: () => import('./about-us/about-us.module')
                    .then(mod => mod.AboutUsModule)
            },
            {
                path: 'terms-and-conditions',
                loadChildren: () => import('./terms-and-conditions/terms-and-conditions.module')
                    .then(mod => mod.TermsAndConditionsModule)
            },
            {
                path: 'terms-of-services',
                loadChildren: () => import('./terms-of-services/terms-of-services.module')
                    .then(mod => mod.TermsOfServicesModule)
            },
            {
                path: 'general-guidelines',
                loadChildren: () => import('./general-guidelines/general-guidelines.module')
                    .then(mod => mod.GeneralGuidelinesModule)
            },
            {
                path: 'privacy-policy',
                loadChildren: () => import('./privacy-policy/privacy-policy.module')
                    .then(mod => mod.PrivacyPolicyModule)
            },
            {
                path: 'forgot-password',
                loadChildren: () => import('./forgot-password/forgot-password.module')
                    .then(mod => mod.ForgotPasswordModule)
            },
            {
                path: 'reset-password/:code',
                loadChildren: () =>
                    import('./reset-password/reset-password.module').then(
                        mod => mod.ResetPasswordModule
                    )
            },
            {
                path: 'verify-email/:code',
                loadChildren: () => import('./verify-email/verify-email.module')
                    .then(mod => mod.VerifyEmailModule)
            },
            {
                path: 'listings',
                loadChildren: () => import('./listings/listings.module')
                    .then(mod => mod.ListingsModule)
            },
            {
                path: 'listing/details/:id',
                loadChildren: () => import('./listing-details/listing-details.module')
                    .then(mod => mod.ListingDetailsModule)
            },
            {
                path: 'business-profile/:id',
                loadChildren: () => import('./business-profile/business-profile.module')
                    .then(mod => mod.BusinessProfileModule)
            },
            {
                path: 'businesses',
                loadChildren: () => import('./businesses/businesses.module')
                    .then(mod => mod.BusinessesModule)
            },
            {
                path: 'add-a-business',
                loadChildren: () => import('./add-a-business/add-a-business.module')
                    .then(mod => mod.AddAbusinessModule)
            },
            {
                path: 'registration-status/:status',
                loadChildren: () => import('./registration-status/registration-status.module')
                    .then(mod => mod.RegistrationStatusModule)
            },
            {
                path: 'for-businesses',
                loadChildren: () => import('./for-businesses/for-businesses.module')
                    .then(mod => mod.ForBusinessesModule)
            },
            {
                path: 'claim-status/:status',
                loadChildren: () => import('./claim-status/claim-status.module')
                    .then(mod => mod.ClaimStatusModule)
            },
            {
                path: '**',
                component: PageNotFoundComponent,
                data: { message: 'Sorry, page not found.' }
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WebsiteRoutes { }
