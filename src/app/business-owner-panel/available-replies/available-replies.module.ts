import { DataService } from './data.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailableRepliesComponent } from './available-replies.component';
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
        {
            path:'',
            component:AvailableRepliesComponent
        }
    ])
  ],
  declarations: [AvailableRepliesComponent],
  providers:[DataService]
})
export class AvailableRepliesModule { }
