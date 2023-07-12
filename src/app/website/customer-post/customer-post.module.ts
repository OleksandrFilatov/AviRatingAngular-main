import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerPostComponent } from './customer-post.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WavesModule, ButtonsModule, InputsModule, IconsModule } from 'angular-bootstrap-md';



@NgModule({
  declarations: [CustomerPostComponent],
  imports: [
    WavesModule,
    ButtonsModule,
    InputsModule,
    IconsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CustomerPostComponent }
    ]),
  ]
})
export class CustomerPostModule { }
