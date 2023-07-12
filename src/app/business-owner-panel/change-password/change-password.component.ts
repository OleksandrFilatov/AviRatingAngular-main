import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers';
;
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    registrationError: string
    changePasswordForm: FormGroup
    newPass: any
    conPass: any
    constructor(
        private fb: FormBuilder,
        private dataService: DataService,
        public ui: UIHelpers,
        private router: Router,
        private alert: IAlertService,
        public apiService: ApiService,
    ) {
        this.changePasswordForm = this.fb.group({
            old_password: new FormControl(null, [Validators.required]),
            new_password: new FormControl(null, [Validators.required]),
            password_confirmation: new FormControl(null, [Validators.required]),
        })
    }

    get g() {
        return this.changePasswordForm.controls
    }

    ngOnInit() {
    }

    changePassword(data: any): boolean {
        this.newPass = this.changePasswordForm.get('new_password').value
        this.conPass = this.changePasswordForm.get('password_confirmation').value

        if (data.status === 'INVALID') {
            this.registrationError = 'Please fill valid Data and try again'

            return false
        } else if (this.newPass !== this.conPass) {
            this.alert.error('Password does not match')

            return false

        }
        this.dataService.changePassword(data.value).subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                this.registrationError = ''
                this.alert.success('Password changed sucessfully')
            }
        })
    }

}
