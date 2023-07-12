import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class AdminSidebarService {
    toggled = false
    _hasBackgroundImage = true
    menus = [
        {
            title: 'Dashboard',
            link: 'dashboard',
            icon: 'fa fa-tachometer-alt',
            active: true,
            type: 'simple'
        },
        {
          title: 'Change Password',
          link: 'change-password',
          icon: 'fa fa-key',
          active: true,
          type: 'simple'
        },
        {
            title: 'Users',
            link: 'users',
            icon: 'fa fa-users',
            active: true,
            type: 'simple'
        },
        {
            title: 'Sub-Admins',
            link: 'admins',
            icon: 'fa fa-users',
            active: true,
            type: 'conditional'
        },
        {
            title: 'Approval Requests',
            link: 'approval-requests',
            icon: 'fa fa-users',
            active: true,
            type: 'simple'
        },
        {
            title: 'Listings',
            link: 'listings',
            icon: 'fa fa-users',
            active: true,
            type: 'simple'
        },
        {

            title: 'Services',
            link: 'services',
            icon: 'fa fa-users',
            active: true,
            type: 'simple'
        },
        {
            title: 'Amenities',
            link: 'amenities',
            icon: 'fa fa-users',
            active: true,
            type: 'simple'
        },
        {
            title: 'Payment History',
            icon: 'fa fa-credit-card',
            active: false,
            type: 'dropdown',
            submenus: [
                {
                    title: 'Business Payment',
                    link: 'business-history',
                    type: 'simple'
                },
                {
                    title: 'Claims',
                    link: 'claims',
                    type: 'simple'
                }
            ]
        },
        {
            title: 'Business Types',
            link: 'business-types',
            icon: 'fas fa-business-time',
            active: true,
            type: 'simple'
        },
        {
            title: 'Business Categories',
            link: 'business-categories',
            icon: 'fa fa-users',
            active: true,
            type: 'simple'
        },
        {

            title: 'Review Reply Prices',
            link: 'review-reply-prices',
            icon: 'fas fa-tags',
            active: true,
            type: 'simple'
        },
        {
            title: 'Settings',
            link: 'setting',
            icon: 'fa fa-users',
            active: true,
            type: 'simple'
        },
        {
            title: 'Memberships',
            link: 'membership',
            icon: 'fa fa-users',
            active: true,
            type: 'simple'
        },
        {
            title: 'Business Claim Requests',
            link: 'business-claims-requests',
            icon: 'fa fa-users',
            active: true,
            type: 'simple'
        },
        {
            title: 'Contact Us',
            link: 'contact-us',
            icon: 'fa fa-users',
            active: true,
            type: 'simple'
        },
        {
            title: 'Bulk Upload',
            link: 'bulk-upload',
            icon: 'fa fa-users',
            active: true,
            type: 'simple'
        },
        {
            title: 'Reviews',
            icon: 'fa fa-users',
            active: false,
            type: 'dropdown',
            submenus: [
                {
                    title: 'Business Reviews',
                    link: 'business-reviews',
                    type: 'simple'
                },
                {
                    title: 'Listing Reviews',
                    link: 'listing-reviews',
                    type: 'simple'
                },
            ]
        }
    ] // menu

    constructor() { }

    toggle() {
        this.toggled = !this.toggled
    }

    getSidebarState() {
        return this.toggled
    }

    setSidebarState(state: boolean) {
        this.toggled = state
    }

    getMenuList() {
        return this.menus
    }

    get hasBackgroundImage() {
        return this._hasBackgroundImage
    }

    set hasBackgroundImage(hasBackgroundImage) {
        this._hasBackgroundImage = hasBackgroundImage
    }
}
