import { ConstantsService } from '../../services/constants.service';
import { UIHelpers } from '../../helpers/ui-helpers'
import { AdminApiService } from '../../services/admin-api.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';
import { DataService } from './data.service'

@Component({
    selector: 'app-listings',
    templateUrl: './listings.component.html',
    styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {
    dataStatus = 'fetching'
    avgRating = ''
    userId = ''
    busniessUsers = []
    userList = []
    userForm: FormGroup
    selectedIndex: any
    modalRef: BsModalRef
    selectedId: any
    page = 1
    pagination: any
    results: any
    busniessStatus = 'fetching'
    busniessModel = ''
    busniessSearchKeyword = 'first_name'

    constructor(
        private adminApi: AdminApiService,
        private fb: FormBuilder,
        private ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
        private elem: ElementRef,
        public router: Router,
        private route: ActivatedRoute,
        public ds: DataService,


    ) {
        this.ds.getBusniess().subscribe((resp: any) => {
            if (resp.success === true) {
                this.busniessUsers = resp.data
                this.busniessStatus = 'done'
            }
        })
        this.route.queryParams.subscribe(params => {

            if (params.page) {
                this.page = params.page
            }
            if (params.avg_rating) {
                this.avgRating = params.avg_rating
            }
            if (params.user_id) {
                this.userId = params.user_id
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
            avg_rating: this.avgRating,
            user_id: this.userId
        }
        this.router.navigate(['/admin/listings'], { queryParams: filtersParam, replaceUrl: true })
    }

    ngOnInit() {

    }
    search(): void {
        const params = {
            page: this.page,
            avg_rating: this.avgRating,
            user_id: this.userId,
        }
        this.ds.getListing(params).subscribe((resp: any) => {
            if (resp.success === true) {
                this.results = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate(['/admin/listings'], { queryParams: params, replaceUrl: true })
            }
        })

    }
    selectedBusniess(item: any) {
        this.userId = item.id
    }

    activeConfirmation(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }

    inactiveConfirmation(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm admin-panel' })
    }
    active() {
        const param = {
            id: this.selectedId
        }
        this.ds.deactive(param).subscribe((resp: any) => {
            if (resp.success == false) {
                this.alert.error(resp.error.general)

                return false
            } else {
                this.alert.success('List activated successfully')
                this.results[this.selectedIndex].status = 'active'
            }
            this.modalRef.hide()
        })
    }

    inactive() {
        const param = {
            id: this.selectedId
        }
        this.ds.deactive(param).subscribe((resp: any) => {
            if (resp.success == false) {
                this.alert.error(resp.error.general)

                return false
            } else {
                this.alert.success('List deactivated successfully')
                this.results[this.selectedIndex].status = 'inactive'
            }
            this.modalRef.hide()
        })
    }
}
