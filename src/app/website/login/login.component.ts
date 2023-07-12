import { ApiService } from '../../services/api.service'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: [
        './login.component.css', 
        '/src/assets/css/resets.css',
        '/src/assets/css/inner-header.css',
        '/src/assets/css/advance-filters.css',
        '/src/assets/css/home-banner.css',
        '/src/assets/css/search.css',
        '/src/assets/css/responsive.css',
    ]
})
export class LoginComponent implements OnInit {
    loginError: string
    constructor(private api: ApiService, private router: Router) {
    }

    ngOnInit() {
    }

    login(data: any): void {
        this.api.login(data).subscribe( (resp: any) => {
            if (resp.success === false) {
                this.loginError = resp.errors.general

                return false
            }

            this.api.doUserRedirects(resp, this.router)
        })
    }
}
