import { HttpClient } from '@angular/common/http'
import { apis } from 'src/environments/environment'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Observable } from 'rxjs'
import { ApiService } from 'src/app/services/api.service'
import { Component, OnInit } from '@angular/core'
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router'
import { LoaderService } from '../services/loader.service'

@Component({
    selector: 'app-business-owner-panel',
    templateUrl: './business-owner-panel.component.html',
    styleUrls: ['./business-owner-panel.component.css']
})
export class BusinessOwnerPanelComponent implements OnInit {
    isLoading: boolean

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

}
