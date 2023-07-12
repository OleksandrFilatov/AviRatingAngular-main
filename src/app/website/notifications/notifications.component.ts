import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'
import { FormBuilder } from '@angular/forms'

import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

import io from 'socket.io-client/dist/socket.io';

declare var $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationsComponent implements OnInit {
  requests = []
  socket: io.Socket

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    private alert: IAlertService
  ) {
    this.api.getRequests().subscribe((resp: any) => {
      this.requests = resp.data;
      console.log("constr");
    })

  }

  ngOnInit(): void {
 
    this.socket.on('join_request', (data) => {
      if (this.api.user.id == data.receiver_id) {
        this.requests.unshift(data);
        this.api.newNotification++;
        this.alert.success('Join is requested.');
      }
    })
  }


  approveJoinRequest(id: any, sender_id: any, index: any): any {
    const data = {
      group_id: id,
      sender_id: sender_id
    }
    this.api.approveJoinRequest(data).subscribe((resp: any) => {
      this.requests.splice(index, 1);
      if (this.api.newNotification > 0) this.api.newNotification--
      this.alert.success('approved')
    })
  }

  rejectJoinRequest(id: any, sender_id: any, index: any): any {
    const data = {
      group_id: id,
      sender_id: sender_id
    }
    this.api.rejectJoinRequest(data).subscribe((resp: any) => {
      this.requests.splice(index, 1);
      if (this.api.newNotification > 0) this.api.newNotification--
      this.alert.success('rejected')
    })
  }

  getImageUrl(id: any) {
    return this.api.baseUrl + '/profile-image/' + id;
  }
}
