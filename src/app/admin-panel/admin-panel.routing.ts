import { MembershipModule } from './membership/membership.module'
import { ServicesModule } from './services/services.module'
import { AdminPanelComponent } from './admin-panel.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminGuard } from '../auth/admin-guard'

const routes: Routes = [
    {
        path: '',
        component: AdminPanelComponent,
        canActivate: [AdminGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module')
                    .then(mod => mod.DashboardModule)
            },
            {
                path: 'admins',
                loadChildren: () => import('./admins/admins.module')
                    .then(mod => mod.AdminsModule)
            },
            {
                path: 'change-password',
                loadChildren: () => import('./change-password/change-password.module')
                    .then(mod => mod.ChangePasswordModule)
            },
            {
                path: 'approval-requests',
                loadChildren: () => import('./approval-requests/approval-requests.module')
                    .then(mod => mod.ApprovalRequestsModule)
            },
            {
                path: 'listings',
                loadChildren: () => import('./listings/listings.module')
                    .then(mod => mod.ListingsModule)
            },
            {
                path: 'subjects',
                loadChildren: () => import('./subjects/subjects.module')
                    .then(mod => mod.SubjectsModule)
            },
            {
                path: 'business-claims',
                loadChildren: () => import('./business-claims/business-claims.module')
                    .then(mod => mod.BusinessClaimsModule)
            },
            {
                path: 'business-claims-requests',
                loadChildren: () => import('./business-claims-requests/business-claims-requests.module')
                    .then(mod => mod.BusinessClaimsRequestsModule)
            },

            {
                path: 'subject-categories',
                loadChildren: () => import('./subject-categories/subject-categories.module')
                    .then(mod => mod.SubjectCategoriesModule)
            },
            {
                path: 'education-level',
                loadChildren: () => import('./education-level/education-level.module')
                    .then(mod => mod.EducationLevelModule)
            },
            {
                path: 'regions',
                loadChildren: () => import('./regions/regions.module')
                    .then(mod => mod.RegionsModule)
            },
            {
                path: 'setting',
                loadChildren: () => import('./setting/setting.module')
                    .then(mod => mod.SettingModule)
            },
            {
                path: 'districts',
                loadChildren: () => import('./districts/districts.module')
                    .then(mod => mod.DistrictsModule)
            },
            {
                path: 'bulk-upload',
                loadChildren: () => import('./bulk-upload/bulk-upload.module')
                    .then(mod => mod.BulkUploadModule)
            },
            {
                path: 'business-reviews',
                loadChildren: () => import('./business-reviews/business-reviews.module')
                    .then(mod => mod.BusinessReviewsModule)
            },
            {
                path: 'listing-reviews',
                loadChildren: () => import('./listing-reviews/listing-reviews.module')
                    .then(mod => mod.ListingReviewsModule)
            },
            {
                path: 'users',
                loadChildren: () => import('./users/users.module')
                    .then(mod => mod.UsersModule)
            },
            {
                path: 'view-profile-business',
                loadChildren: () => import('./view-busniess-owner/view-busniess-owner.module')
                    .then(mod => mod.ViewBusniessOwnerComponentModule)
            },
            {
                path: 'view-profile-customer',
                loadChildren: () => import('./view-customer/view-customer.module')
                    .then(mod => mod.ViewCustomerComponentModule)
            },
            {
                path: 'profile-playgroup',
                loadChildren: () => import('./edit-profile-playgroup/edit-profile-playgroup.module')
                    .then(mod => mod.EditProfilePlaygroupModule)
            },
            {
                path: 'profile-center',
                loadChildren: () => import('./edit-profile-center/edit-profile-center.module')
                    .then(mod => mod.EditProfileCenterModule)
            },
            {
                path: 'profile-tutor',
                loadChildren: () => import('./edit-profile-tutor/edit-profile-tutor.module')
                    .then(mod => mod.EditProfileTutorModule)
            },
            {
                path: 'classes',
                loadChildren: () => import('./classes/classes.module')
                    .then(mod => mod.ClassesModule)
            },
            {
                path: 'profile-student',
                loadChildren: () => import('./edit-profile-student/edit-profile-student.module')
                    .then(mod => mod.EditProfileStudentModule)
            },
            {
                path: 'educations',
                loadChildren: () => import('./educations/educations.module')
                    .then(mod => mod.EducationsModule)
            },
            {
                path: 'super-password',
                loadChildren: () => import('./super-password/super-password.module')
                    .then(mod => mod.SuperPasswordModule)
            },
            {
                path: 'services',
                loadChildren: () => import('./services/services.module')
                    .then(mod => mod.ServicesModule)
            },
            {
                path: 'review-reply-prices',
                loadChildren: () => import('./review-price/review-price.module')
                    .then(mod => mod.ReviewPriceModule)
            },
            {
                path: 'amenities',
                loadChildren: () => import('./amenities/amenities.module')
                    .then(mod => mod.AmenitiesModule)
            },
            {
                path: 'business-categories',
                loadChildren: () => import('./business-categories/business-categories.module')
                    .then(mod => mod.BusinessCategoriesModule)
            },
            {
                path: 'membership',
                loadChildren: () => import('./membership/membership.module')
                    .then(mod => mod.MembershipModule)
            },
            {
                path: 'contact-us',
                loadChildren: () => import('./contact-us/contact-us.module')
                    .then(mod => mod.ContactUsModule)
            },
            {
                path: 'business-types',
                loadChildren: () => import('./business-types/business-types.module')
                    .then(mod => mod.BusinessTypesModule)
            },
            {
                path: 'business-history',
                loadChildren: () => import('./payment-history/payment-history.module')
                    .then(mod => mod.PaymentHistoryModule)
            },
            {
                path: 'claims',
                loadChildren: () => import('./claims/claims.module')
                    .then(mod => mod.ClaimsModule)
            },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminPanelRoutes { }
