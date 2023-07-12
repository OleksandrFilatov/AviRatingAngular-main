import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { DataService } from './data.service'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from '../../services/api.service'

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    forgotError: string
    constructor(
        private dataService: DataService,
        private router: Router,
        public apiService: ApiService,
        public alert: IAlertService
    ) {
    }

    forgotPassword(data: any): boolean {
        if (data.status == 'INVALID') {
            this.alert.error('Please provide Email')

            return false
        }
        this.dataService.forgotPassword(data.value).subscribe((resp: any) => {
            if (resp.success === false) {
                this.forgotError = resp.errors.general

                return false
            } else {
                this.alert.success('Password link has been sent successfully')
                this.router.navigate(['/'])
            }

        })
    }
    ngOnInit() {
    }

}
