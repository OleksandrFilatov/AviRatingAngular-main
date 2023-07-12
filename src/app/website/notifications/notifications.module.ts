import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatCardModule, } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CardsModule, CarouselModule, WavesModule, ButtonsModule, InputsModule, IconsModule } from 'angular-bootstrap-md';
import { MatTabsModule } from '@angular/material';
import { NgxPaginationModule } from 'ngx-pagination';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    InfiniteScrollModule,
    NgxPaginationModule,
    InputsModule,
    IconsModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    CarouselModule,
    WavesModule,
    MatCardModule,
    CommonModule,
    SharedModule,
    CardsModule,
    ButtonsModule,
    RouterModule.forChild([
      { path: '', component: NotificationsComponent }
    ])
  ],
  declarations: [NotificationsComponent]
})
export class NotificationsModule { }
