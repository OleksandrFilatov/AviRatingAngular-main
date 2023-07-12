import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyPostsComponent } from './my-posts.component';
import { SharedModule } from '../shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { NgImageSliderModule } from 'ng-image-slider';
import { CarouselModule, WavesModule, ButtonsModule } from 'angular-bootstrap-md';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    ScrollingModule,
    InfiniteScrollModule,
    CarouselModule,
    WavesModule,
    NgSelect2Module,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonsModule,
    RouterModule.forChild([
      { path: '', component: MyPostsComponent }
    ]),
    ImageCropperModule,
    MatFormFieldModule,
    ModalModule.forRoot(),
    MatSelectModule,
    NgImageSliderModule,
  ],
  declarations: [MyPostsComponent]
})
export class MyPostsModule { }
