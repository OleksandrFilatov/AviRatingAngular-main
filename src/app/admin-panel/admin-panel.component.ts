import { Component, OnInit } from '@angular/core'
import { AdminSidebarService } from './admin-shared/admin-sidebar/admin-sidebar.service'
import { LoaderService } from '../services/loader.service'

@Component({
    selector: 'app-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
    isLoading: boolean

    constructor(
        private loader: LoaderService,
        public sidebarservice: AdminSidebarService
    ) {
        this.loader.isLoading.asObservable().subscribe( (state) => {
            setTimeout( _ => this.isLoading = state, 0)
        })
    }

    ngOnInit() {
    }

    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState())
    }
    toggleBackgroundImage() {
        this.sidebarservice.hasBackgroundImage = !this.sidebarservice.hasBackgroundImage
    }
    getSideBarState() {
        return this.sidebarservice.getSidebarState()
    }

    hideSidebar() {
        this.sidebarservice.setSidebarState(true)
    }
}
