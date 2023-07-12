import { Observable } from 'rxjs'
import { ApiService } from '../services/api.service'
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class WebsiteGuard implements CanActivate {

    constructor(private api: ApiService, private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
        if (this.api.isAuthenticated()) {
            if (this.api.isAdmin()) {
                // this.router.navigateByUrl('admin/dashboard')
            } else if (this.api.isCustomer()) {
                // this.router.navigateByUrl('agency/dashboard')
            }

            return true
        } else {
            return true
        }
    }
}
