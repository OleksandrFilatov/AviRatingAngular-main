import { SharedModule } from 'src/app/website/shared/shared.module'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { CollapseModule } from 'ngx-bootstrap/collapse'
import { RouterModule } from '@angular/router'
import { FooterComponent } from './footer/footer.component'
import { HeaderComponent } from './header/header.component'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

@NgModule({
    imports: [
        FormsModule,
        SharedModule,
        CollapseModule.forRoot(),
        BsDropdownModule.forRoot(),
        RouterModule
    ],
    declarations: [
        HeaderComponent,
        FooterComponent,
    ],
    exports: [
        HeaderComponent,
        FooterComponent
    ]
})
export class LayoutModule { }
