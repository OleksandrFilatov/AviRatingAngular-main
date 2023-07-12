import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationLevelComponent } from './education-level.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/website/shared/shared.module';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    AdminSharedModule,
    SharedModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: EducationLevelComponent }
  ])
  ],
  declarations: [EducationLevelComponent]
})
export class EducationLevelModule { }
