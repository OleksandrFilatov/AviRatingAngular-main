import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGroupComponent } from './create-group.component';
import { SharedModule } from '../shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';

@NgModule({
  imports: [
    // ReactiveFormsModule,
    NgSelect2Module,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: CreateGroupComponent }
    ]),
    ImageCropperModule,
    MatFormFieldModule,
    ModalModule.forRoot(),
    MatSelectModule,
  ],
  declarations: [CreateGroupComponent]
})
export class CreateGroupModule { }