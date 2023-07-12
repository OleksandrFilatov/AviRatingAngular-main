import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewPriceComponent } from './review-price.component';
import { DataService } from './data.service';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/website/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    SharedModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild([
        {
        path:'',
        component:ReviewPriceComponent
        }
    ])
  ],
  declarations: [ReviewPriceComponent],
  providers:[DataService]
})
export class ReviewPriceModule { }
