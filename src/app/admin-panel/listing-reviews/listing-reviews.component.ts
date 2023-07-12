
import { Component, OnInit, TemplateRef } from '@angular/core'
import { DataService } from './data.service'
import * as moment from 'moment'
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';

@Component({
    selector: 'app-listing-reviews',
    templateUrl: './listing-reviews.component.html',
    styleUrls: ['./listing-reviews.component.scss']
})
export class ListingReviewsComponent implements OnInit {
    userReviewsList: any = []
    selectedId: any
    selectedIndex: any
    modalRef: BsModalRef
    fromDate: any = new Date()
    toDate: any = new Date()
    searchName: any = ''
    dataStatus = 'fetching'
    page = 1
    pagination: any
    constructor(
        public adminApi: DataService,
        private ms: BsModalService,
        public alert: IAlertService
    ) {

    }

    ngOnInit() {
        this.searchReviews()
    }

    searchReviews() {
        const params = {
            page: this.page,
            from_date: moment(this.fromDate).format('YYYY-MM-DD'),
            to_date: moment(this.toDate).format('YYYY-MM-DD'),
            name: this.searchName
        }
        this.adminApi.getUserReviews(params).subscribe((resp: any) => {
            if (resp.success === true) {
                this.userReviewsList = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
            }
        })
    }

    setPagination(page: number) {
        this.page = page
        this.searchReviews()
    }

    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm modal-dialog-centered admin-panel' })
    }

    deleteReview() {
        const params = {
            id: this.selectedId
        }
        this.adminApi.deleteReview(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    this.userReviewsList.splice(this.selectedIndex, 1)
                    this.modalRef.hide()
                    this.alert.success('Review deleted successfully!!')
                }
            })
    }

}
