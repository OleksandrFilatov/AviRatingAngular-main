import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReplyPaymentStatusComponent } from './reply-payment-status.component'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
        {path:'', component: ReplyPaymentStatusComponent}
      ])
  ],
  declarations: [ReplyPaymentStatusComponent]
})
export class ReplyPaymentStatusModule { }
