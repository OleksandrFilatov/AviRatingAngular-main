import { ConstantsService } from './../../services/constants.service';
import { UIHelpers } from './../../helpers/ui-helpers'
import { AdminApiService } from './../../services/admin-api.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import * as moment from 'moment'

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    dataStatus = 'fetching'
    moment = moment
    name: any = ''
    registrationDate = ''
    userType = ''
    userList = []
    userForm: FormGroup
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any
    page = 1
    pagination: any
    nameOrder = ''
    results: any
    userTypes = ConstantsService.USER_ROLES
    dateFormat: any
    constructor(
        private adminApi: AdminApiService,
        private fb: FormBuilder,
        private ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        private elem: ElementRef,
        public router: Router,
        private route: ActivatedRoute,
        private cs: ConstantsService


    ) {
        this.dateFormat = this.cs.DATE_TIME_FORMAT.SHORT_DATE
        this.route.queryParams.subscribe(params => {

            if (params.page) {
                this.page = params.page
            }
            if (params.name) {
                this.name = params.name
            }
            if (params.registration_date) {
                this.registrationDate = params.registration_date
            }
            if (params.user_type) {
                this.userType = params.user_type
            }
            if (params.name_order) {
                this.nameOrder = params.name_order
            }
            if (params) {
                this.search()
            }
        })
    }

    setPagination(page: number) {
        let filtersParam: any = {}

        filtersParam = {
            page,
            name: this.name,
            registration_date: this.registrationDate,
            user_type: this.userType,
            name_order: this.nameOrder
        }
        this.router.navigate(['/admin/users'], { queryParams: filtersParam, replaceUrl: true })
    }

    ngOnInit() {

    }
    search(): void {
        const params = {
            page: this.page,
            name: this.name,
            registration_date: this.registrationDate,
            user_type: this.userType,
            name_order: this.nameOrder
        }
        this.adminApi.getUsers(params).subscribe((resp: any) => {
            if (resp.success === true) {
                this.results = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/admin/users'], { queryParams: params, replaceUrl: true })
            }
        })

    }
    redirectToUserProfileEdit(u: any) {
        const params: any = {
            id: u.id
        }
        this.router.navigate(['/admin/profile-' + u.user_type], { queryParams: params, replaceUrl: true })
    }

    cancelClaim(id: number, index: number) {
        this.selectedId = id
        this.selectedIndex = index
        const data = { id: this.selectedId }
        this.adminApi.cancelClaim(data).subscribe((resp: any) => {
            if (resp.success === true) {
                this.alert.success('Cancel Claim successfully!!')
                this.results[this.selectedIndex].claim_business = 0
            }
        })

    }

    redirectToUserProfile(u: any) {
        const params: any = {
            id: u.id
        }
        this.router.navigate(['/admin/view-profile-' + u.user_type], { queryParams: params, replaceUrl: true })
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    featuredUser() {
        const params = {
            id: this.selectedId
        }
        this.adminApi.featuredUser(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    const deletingIndex = this.userList.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.userList[this.selectedIndex].featured = 1
                    this.modalRef.hide()
                    this.alert.success('Featured User successfully!!')
                }
            })
    }

    featuredUserCancel() {
        const params = {
            id: this.selectedId
        }
        this.adminApi.featuredUserCancel(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    const deletingIndex = this.userList.findIndex((d: any) => {
                        this.userList[this.selectedIndex].featured = 0
                    })
                    this.modalRef.hide()
                    this.alert.success('User UnFeatured successfully!!')
                }
            })
    }

    deleteUser() {
        const params = {
            id: this.selectedId
        }
        this.adminApi.deleteUser(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    const deletingIndex = this.results.findIndex((d: any) => {
                        return d.id === this.selectedId
                    })
                    this.results.splice(deletingIndex, 1)
                    this.modalRef.hide()
                    this.alert.success('User deleted successfully!!')
                }
            })
    }
    cancelMemberShip() {
        let subId = this.results[this.selectedIndex].subscription.id
        const params = {
            user_id: this.selectedId,
            subscription_id: subId
        }

        this.adminApi.cancelSubscription(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    this.results[this.selectedIndex].subscription = null
                    this.modalRef.hide()
                    this.alert.success('Membership cancelled successfully!!')
                }
            })
    }
}
