import { IRatingModule } from 'src/app/libs/irating/irating.module';
import { SharedModule } from 'src/app/website/shared/shared.module';
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ListingDetailsComponent } from './listing-details.component'
import { LightboxModule } from 'ngx-lightbox'
import { ReactiveFormsModule } from '@angular/forms'


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IRatingModule,
    LightboxModule,
    ReactiveFormsModule,
    RouterModule.forChild([
        { path: '', component: ListingDetailsComponent }
    ])
  ],
  declarations: [ListingDetailsComponent],
  providers : [ DataService ]
})
export class ListingDetailsModule { }
