import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralGuidelinesComponent } from './general-guidelines.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
        { path: '', component: GeneralGuidelinesComponent }
    ])
  ],
  declarations: [GeneralGuidelinesComponent]
})
export class GeneralGuidelinesModule { }
