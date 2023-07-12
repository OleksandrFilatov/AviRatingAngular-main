import { IRatingModule } from './../../libs/irating/irating.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingsComponent } from './listings.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IRatingModule,
    RouterModule.forChild([
        { path: '', component: ListingsComponent }
    ])
  ],
  declarations: [ListingsComponent]
})
export class ListingsModule { }
