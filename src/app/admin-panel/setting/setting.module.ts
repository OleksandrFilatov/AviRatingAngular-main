import { DataService } from './data.service';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from './../../website/shared/shared.module';
import { AdminSharedModule } from './../admin-shared/admin-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    SharedModule,
    ModalModule.forChild(),
    ReactiveFormsModule,
    RouterModule.forChild([
      {path:'', component:SettingComponent}
    ])
  ],
  declarations: [SettingComponent],
  providers:[DataService]
})
export class SettingModule { }
