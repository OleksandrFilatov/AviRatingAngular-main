import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirportComponent } from './airport.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WavesModule, ButtonsModule, InputsModule, IconsModule } from 'angular-bootstrap-md';
@NgModule({

  imports: [
    WavesModule,
    ButtonsModule,
    InputsModule,
    IconsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: AirportComponent }
    ]),
    CommonModule
  ],

  declarations: [AirportComponent]
})
export class AirportModule { }
