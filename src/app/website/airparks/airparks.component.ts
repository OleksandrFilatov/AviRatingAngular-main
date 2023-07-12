import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { SocketsService } from 'src/app/services/sockets.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

declare var $: any;

@Component({
  selector: 'app-airparks',
  templateUrl: './airparks.component.html',
  styleUrls: ['./airparks.component.scss']
})
export class AirparksComponent implements OnInit {

  myGroupList: any = []
  nearGroupList: any = []
  buttonState = 2;

  myForm: FormGroup
  mySearchForm: FormGroup
  nearSearchForm: FormGroup

  near_search_content = ''

  cards = [];
  slides: any = [[]];

  throttle = 0;
  distance = 2;
  page = 1;
  card_list: any = [];

  // page = 1;
  count = 0;
  tableSize = 3;

  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public socketService: SocketsService,
    public api: ApiService,
    private alert: IAlertService,
  ) {
    this.initializeMyForm();
    this.initializeMySearchForm();
    this.initializeNearSearchForm();

    this.api.getMyGroupList({ my_search_content: '' }).subscribe((resp: any) => {
      if (resp != null) {
        this.myGroupList = resp.data
      } else {
        this.myGroupList = []
      }
    })
    this.api.getNearGroupList({ near_search_content: '' }).subscribe((resp: any) => {
      if (resp != null) {
        this.nearGroupList = resp.data
      } else {
        this.nearGroupList = []
      }
    })
    this.api.getAirportsInAirparks({ search_content: '' }).subscribe((resp: any) => {

      if (resp != null) {
        this.cards = resp.data
      } else {
        this.cards = []
      }
    })
  }

  ngOnInit() {
    // this.socket = io.connect('http://192.168.114.57:5000');
  }

  sendRequest(request) {
    this.socketService.socket.emit('send_request', request);
  }

  requestJoin(groupid: any, index: any) {
    const data = {
      group_id: groupid
    }
    this.api.requestJoin(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return false
      } else {
        this.nearGroupList[index].state = 'in progress'
        this.sendRequest(resp.data)
        this.alert.success(resp.msg)
      }
    })
  }


  join(groupid: any) {
    const data = {
      group_id: groupid
    }
    this.api.join(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return false
      } else {
        this.router.navigate(['/group-post/' + groupid])
        this.alert.success('joined')
      }
    })
  }

  onTableDataChange(event) {
    this.page = event;
  }

  initializeMyForm() {
    this.myForm = this.fb.group({
      search_content: new FormControl(null, [Validators.minLength(5)]),
    })
  }

  initializeMySearchForm() {
    this.mySearchForm = this.fb.group({
      my_search_content: new FormControl(null, []),
    })
  }

  initializeNearSearchForm() {
    this.nearSearchForm = this.fb.group({
      near_search_content: new FormControl(null, []),
    })
  }

  submit(data: any, type: any) {
    let formData = {};
    switch (type) {
      case 0:
        this.page = 1;
        formData = this.api.jsonToFormData(data.value);
        this.api.getAirportsInAirparks(formData).subscribe((resp: any) => {
          if (resp.success === false) {
            this.alert.error(resp.errors.general)
            return false
          } else {
            this.cards = resp.data;
          }
        })
        break;
      case 1:
        formData = this.api.jsonToFormData(data.value)
        this.api.getNearGroupList(formData).subscribe((resp: any) => {
          this.nearGroupList = resp.data
        })
        break;
      case 2:
        formData = this.api.jsonToFormData(data.value)
        this.api.getMyGroupList(formData).subscribe((resp: any) => {
          this.myGroupList = resp.data
        })
        break;
    }
  }

  toggleSubscribe(airportid: any): any {
    let state = 0;
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].airport_id == airportid) {
        state = 1 - this.cards[i].subscribed_state;
        this.cards[i].subscribed_state = state;
      }
    }
    this.api.toggleSubscribe({ airport_id: airportid, state: state }).subscribe((resp: any) => {
      this.api.getNearGroupList({ near_search_content: this.near_search_content }).subscribe((resp: any) => {
        this.nearGroupList = resp.data
      })
    })
  }

  getImageUrl(data: any): string {
    return this.api.baseUrl + '/group-image/' + data
  }

  signup_alert() {
    this.alert.error('Please sign up to add Airparks')
  }
}