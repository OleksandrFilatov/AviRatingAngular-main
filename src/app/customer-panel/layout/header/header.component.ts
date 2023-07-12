import { ApiService } from '../../../services/api.service'
import { Component, OnInit} from '@angular/core'
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown'
import { ConstantsService } from 'src/app/services/constants.service'
import { Router,NavigationEnd } from '@angular/router'
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: [
        './header.component.css',
        '/src/assets/css/inner-header.css',
        '/src/assets/css/search.css'
    ],
    providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class HeaderComponent implements OnInit {
    showSearch: any
    isCollapsed = true
    isAuthenticated = false
    isBusinessOwner = false
    isAdmin = false
    isCustomer = false
    profilePicture: any
    userName: any
    userImage: string
    languages = this.cs.LANGUAGES
    businessName = ''
    userImageSubscription: any
    filterBusiness = {
        business_name : null,
        cat_name : null,
        rating : null,
        zip_code : null,

    }
    constructor(
        public api: ApiService,
        public cs: ConstantsService,
        public router: Router,

    ) {
        router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        )
            .subscribe(event => {
                if (event instanceof NavigationEnd) {
                    const strArr = event.url.split('?')
                    if (strArr[0] == '/') {
                        this.showSearch = false
                    } else {
                        this.showSearch = true
                    }
                }
            })
        api.userLoggedInObs.subscribe(m => {
            this.isAuthenticated = m
            if (this.isAuthenticated) {
                this.loginUpdates()
            }
        })
    }

    loginUpdates(): void {
        this.isCustomer = this.api.isCustomer()
        this.isBusinessOwner = this.api.isBusinessOwner()
        this.isAdmin = this.api.isAdmin()

        if (this.api.user.user_type === 'customer') {
            this.profilePicture = this.api.baseUrl + '/customer/profile-picture/' + this.api.user.id
        } else {
            this.profilePicture = this.api.baseUrl + '/buniess-owner/profile-picture/' + this.api.user.id
        }
        this.userName = this.api.user.name
    }

    ngOnInit() {
        console.log('started')
        this.userImage = this.api.userImageUrl(this.api.user.id)
        this.userImageSubscription = this.api.userImage.subscribe((resp: string) => {
            this.userImage = resp
        })
    }

    logOut(): void {
        const check = this.api.logOut()
        if (check) {
            location.reload()
        }
    }

    redirectUser(value: any) {
        if (value === 'customer-profile' && value !== '') {
            const url = this.router.createUrlTree([value + '/' + this.api.user.id])
            window.open(url.toString(), '_blank')
        } else if (value !== 'customer-profile' && value !== '') {
            this.router.navigate(['customer/' + value])
        }
    }

    searchBusiness () {
        const params = {
            page: 1,
            business_name: this.filterBusiness.business_name,
            cat_name: this.filterBusiness.cat_name,
            rating: null,
            zip_code: this.filterBusiness.zip_code,

        }
        this.router.navigate(['/businesses'], { queryParams: params, replaceUrl: true })
    }

    ngOnDestroy() {
        this.userImageSubscription.unsubscribe()
        console.log('stopped')
    }
}
