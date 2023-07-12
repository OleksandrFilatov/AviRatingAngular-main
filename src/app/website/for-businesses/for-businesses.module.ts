import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForBusinessesComponent } from './for-businesses.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
        { path: '', component: ForBusinessesComponent }
    ])
  ],
  declarations: [ForBusinessesComponent]
})
export class ForBusinessesModule { }
