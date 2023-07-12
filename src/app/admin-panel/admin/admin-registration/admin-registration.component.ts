import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../data.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';

@Component({
    selector: 'app-admin-registration',
    templateUrl: './admin-registration.component.html',
    styleUrls: ['./admin-registration.component.css']
})
export class AdminRegistrationComponent implements OnInit {
    @Input() modalRef: BsModalRef
    @Input() index: number

    adminGroup: FormGroup
    title: string

    constructor(
        private fb: FormBuilder,
        public dataService: DataService,
        public ui: UIHelpers,
        private alert: IAlertService

    ) {
        this.adminGroup = this.fb.group({
            id: [0],
            user_name: ['', [Validators.required, Validators.maxLength(30)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['']
        })
    }

    get g() {
        return this.adminGroup.controls
    }

    save(data: any): boolean {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')

            return false
        }

        let saveMethod = this.dataService.save(data.value)
        if (data.value.id > 0) {
            const param = {
                id: data.value.id,
                user_name: data.value.user_name,
                email: data.value.email
            }
            saveMethod = this.dataService.update(param)
        } else {
            if (data.value.password === "") {
                this.alert.error('Please Enter Password')

                return false
            }
        }
        saveMethod.subscribe((resp: any) => {
            if (resp.success === false) {
                this.alert.error(resp.errors.general)

                return false
            } else {
                if (this.index > -1) {
                    this.dataService.updateItem(data.value, this.index)
                    this.alert.success('Changes saved successfully')
                } else {
                    data.value.id = resp.data
                    this.dataService.addItem(data.value)
                    this.alert.success('Admin added successfully')
                }
                this.modalRef.hide()
            }
        })
    }

    ngOnInit() {
        if (this.index > -1) {
            const data = this.dataService.getItem(this.index)
            this.adminGroup.patchValue(data)
        }
    }
}
