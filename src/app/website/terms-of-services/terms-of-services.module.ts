import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsOfServicesComponent } from './terms-of-services.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
        { path: '', component: TermsOfServicesComponent }
    ])
  ],
  declarations: [TermsOfServicesComponent]
})
export class TermsOfServicesModule { }
