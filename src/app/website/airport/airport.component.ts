import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

import { SocketsService } from 'src/app/services/sockets.service'

@Component({
  selector: 'app-airport',
  templateUrl: './airport.component.html',
  styleUrls: ['./airport.component.scss']
})
export class AirportComponent implements OnInit {
  airparksForm: FormGroup
  airparks = []
  airport_id: any
  airportInfo: any
  airport_name: any
  airport_latitude: any
  airport_longitude: any
  airport_subscribed_state: any
  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public socketService: SocketsService,
    public router: Router,
    public api: ApiService,
    public alert: IAlertService
  ) {
    this.initializeAirparksForm();
    this.airport_id = this.route.snapshot.paramMap.get('airport_id');

    this.api.getAirparksByAirport({ airport_id: this.airport_id, search_content: "" }).subscribe((resp: any) => {
      this.airparks = resp.data
    })
    this.api.getAirportInfo({ airport_id: this.airport_id }).subscribe((resp: any) => {
      this.airportInfo = resp.data;
      this.airport_subscribed_state = this.airportInfo[0].subscribed_state
      this.airport_name = this.airportInfo[0].airport_name
      this.airport_latitude = this.airportInfo[0].latitude_deg > 0 ? this.airportInfo[0].latitude_deg + ' North Latitue' : Math.abs(this.airportInfo[0].latitude_deg) + ' South Latitude'
      this.airport_longitude = this.airportInfo[0].longitude_deg > 0 ? this.airportInfo[0].longitude_deg + ' East Longitude' : Math.abs(this.airportInfo[0].longitude_deg) + ' West Longitude'
    })
  }

  ngOnInit(): void {
  }

  sendRequest(request) {
    this.socketService.socket.emit('send_request', request);
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

  requestJoin(groupid: any, index: any) {
    const data = {
      group_id: groupid
    }
    this.api.requestJoin(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return false
      } else {
        // this.airparks[index].state = 'in progress'
        this.sendRequest(resp.data)
        this.alert.success("Your request has been sent successfully.")
      }
    })
  }


  initializeAirparksForm() {
    this.airparksForm = this.fb.group({
      search_content: new FormControl(null, [Validators.minLength(5)]),
    })
  }

  getImageUrl(data: any): string {
    return this.api.baseUrl + '/group-image/' + data
  }

  submit(data: any) {
   
    let formData = this.api.jsonToFormData(data.value)
    formData.append("airport_id", this.airport_id)
    this.api.getAirparksByAirport(formData).subscribe((resp: any) => {
      this.airparks = resp.data
    })
  }

  toggleSubscribe(airportid: any, set_state: any): any {
    
    this.api.toggleSubscribe({ airport_id: airportid, state: set_state }).subscribe((resp: any) => {
      this.airport_subscribed_state = set_state
      
    })
  }

  signup_alert() {
    this.alert.error('Please sign up')
  }
}
