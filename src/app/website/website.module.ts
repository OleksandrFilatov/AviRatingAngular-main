import { WebsiteService } from './../services/website.service'
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar'
import { LayoutModule } from './layout/layout.module'
import { SharedModule } from './shared/shared.module'
import { NgModule } from '@angular/core'
import { WebsiteComponent } from './website.component'
import { WebsiteRoutes } from './website.routing';



@NgModule({
    imports: [
        NgScrollbarModule,
        SharedModule,
        LayoutModule,
        WebsiteRoutes
    ],
    declarations: [WebsiteComponent],
    providers: [
        WebsiteService,
        {
            provide: NG_SCROLLBAR_OPTIONS,
            useValue: {
            }
        }
    ]
})
export class WebsiteModule {
}
