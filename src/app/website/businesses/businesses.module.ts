import { IRatingModule } from '../../libs/irating/irating.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessesComponent } from './businesses.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    SharedModule,
    IRatingModule,
    RouterModule.forChild([
        { path: '', component: BusinessesComponent }
    ])
  ],
  declarations: [BusinessesComponent]
})
export class BusinessesModule { }
