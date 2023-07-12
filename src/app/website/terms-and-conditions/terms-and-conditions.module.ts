import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            { path: 'detail', component: TermsAndConditionsComponent }
        ])
    ],
    declarations: [TermsAndConditionsComponent],
    exports: [TermsAndConditionsComponent]
})
export class TermsAndConditionsModule { }
