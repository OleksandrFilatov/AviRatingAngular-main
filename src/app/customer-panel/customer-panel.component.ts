import { HttpClient } from '@angular/common/http'
import { apis } from 'src/environments/environment'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Observable } from 'rxjs'
import { ApiService } from 'src/app/services/api.service'
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router'
import { LoaderService } from '../services/loader.service'
import { NgScrollbar } from 'ngx-scrollbar'

@Component({
    selector: 'app-customer-panel',
    templateUrl: './customer-panel.component.html',
    styleUrls: ['./customer-panel.component.css']
})
export class CustomerPanelComponent implements OnInit, AfterViewInit {
    @ViewChild(NgScrollbar, { static: true }) scrollbarRef: NgScrollbar
    isLoading: boolean
    scrollbarSub: any

    constructor(
        private route: Router,
        public loader: LoaderService,
        public api: ApiService
    ) {
        this.loader.isLoading.asObservable().subscribe((state) => {
            setTimeout(_ => this.isLoading = state, 0)
        })
    }

    ngOnInit() {
        this.route.events.subscribe((routerEvent: Event) => {
            if (routerEvent instanceof NavigationEnd) {
                window.scrollTo(0, 0)
            }
        })
    }


    ngAfterViewInit(): void {
        this.scrollbarSub = this.scrollbarRef.scrolled
            .subscribe(e => {
                const getHight = e.target.scrollHeight - e.target.scrollTop
                if ((getHight - e.target.clientHeight) < 500) {
                    console.log(getHight, e.target.clientHeight, getHight - e.target.clientHeight)
                    this.api.toggleScrollBottom(true)
                } else {
                    this.api.toggleScrollBottom(false)
                }
            })
    }

}
