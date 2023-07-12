import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from 'src/app/services/api.service'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { DataService } from './data.service'

@Component({
    selector: 'app-listing',
    templateUrl: './listing.component.html',
    styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
    userType: any
    selectedIndex: any
    selectedId: any
    dataStatus = 'fetching'
    productsList: any = []
    page = 1
    pagination: any
    fetching = false
    results: any = []
    modalRef: BsModalRef

    constructor(
        private ds: DataService,
        private alert: IAlertService,
        private ms: BsModalService,
        public router: Router,
        private route: ActivatedRoute,
        public api: ApiService
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.page) {
                this.page = params.page
            }
            this.getList()
        })
    }

    addNewList(){
        this.ds.checkAllowList().subscribe((resp:any) => {
            if(resp.success == true){
                this.router.navigate(['/business-owner/listing/add',-1])
            }
            else{
                this.alert.error(resp.errors.general)
            }
        })
    }

    changeStatus(id,index,status){
        const Params = {
            id : id,
            subscription_status: status
        }
        this.ds.changeStatus(Params).subscribe((resp:any)=> {
            if(resp.success == true){
                this.alert.success('status change successfully')
                this.results[index].subscription_status = status
            }else{
                this.alert.error(resp.errors.general)
            }
        })
    }


    confirmingModal(template: TemplateRef<any>, id: any, i: any) {
        this.selectedId = id
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, { class: 'modal-sm website' })
    }

    setPagination(page: number) {
        let filtersParam: any = {}

        filtersParam = {
            page
        }
        this.router.navigate([`/business-owner/listing/list`], { queryParams: filtersParam, replaceUrl: true })
    }

    getList() {
        const mergeParams: any = {
            page: this.page
        }
        this.ds.getListing(this.page).subscribe((resp: any) => {
            if (resp.success === true) {
                this.fetching = true
                this.results = resp.data.data
                this.pagination = resp.data
                this.dataStatus = 'done'
                this.router.navigate([`/business-owner/listing/list`], { queryParams: mergeParams, replaceUrl: true })
            }
        })
    }

    deleteProduct() {
        const params = {
            id: this.selectedId
        }
        this.ds.deleteListiing(params)
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    this.alert.error(resp.errors.general)
                    this.modalRef.hide()

                    return false
                } else {
                    this.results.splice(this.selectedIndex, 1)
                    this.modalRef.hide()
                    this.alert.success('lisiting deleted successfully!!')
                }
            })
    }

}
