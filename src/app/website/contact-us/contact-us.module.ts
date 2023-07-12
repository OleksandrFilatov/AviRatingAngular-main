import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsComponent } from './contact-us.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    
    SharedModule,
        RouterModule.forChild([
            { path: '', component: ContactUsComponent }
        ])
  ],
  declarations: [ContactUsComponent]
})
export class ContactUsModule { }
