import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from '../data.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service';


@Component({
    selector: 'app-admin-list',
    templateUrl: './admin-list.component.html',
    styleUrls: ['./admin-list.component.css'],
    providers: [DataService]
})
export class AdminListComponent implements OnInit {
    modalRef: BsModalRef
    selectedIndex = -1
    deletingIndex = -1
    simpleError: string

    constructor(
        private modalService: BsModalService,
        public dataService: DataService,
        private alert: IAlertService
    ) {
        this.dataService.list()
            .subscribe((resp: any) => {
                if (resp.success === false) {
                    return false
                } else {
                    this.dataService.updateSource(resp.data)
                }
            })
    }

    ngOnInit(): void {
    }

    edit(template: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'modal-lg modal-dialog-centered' })
        )
    }

    add(template: TemplateRef<any>) {
        this.edit(template, -1)
    }

    delete() {
        this.dataService.delete(this.deletingIndex)
        .subscribe((resp: any) => {
            if (resp.success === false) {
                this.simpleError = resp.errors.general

                return false
            } else {
                this.alert.success('Deleted Successfully!!')
                this.dataService.deleteItem(this.deletingIndex)
                this.deletingIndex = -1
            }
        })
    }
}
