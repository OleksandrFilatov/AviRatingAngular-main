import { AddAbusinessComponent } from './add-a-business.component';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Routes, RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { IRatingModule } from 'src/app/libs/irating/irating.module';
import { AgmCoreModule } from '@agm/core';
import { apis } from 'src/environments/environment'

const routes: Routes = [
    { path: '', component: AddAbusinessComponent }
]

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        IRatingModule,
        RouterModule.forChild(routes),
        AgmCoreModule.forRoot({
            apiKey: apis.googleApiKey,
            libraries: ['places']
        }),
    ],
    declarations: [AddAbusinessComponent],
    exports: [RouterModule]
})
export class AddAbusinessModule {}
