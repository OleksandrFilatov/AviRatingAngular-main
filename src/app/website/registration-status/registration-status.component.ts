import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,  } from '@angular/router'

@Component({
  selector: 'app-registration-status',
  templateUrl: './registration-status.component.html',
  styleUrls: ['./registration-status.component.css']
})
export class RegistrationStatusComponent implements OnInit {
    status = ''
  constructor(private route: ActivatedRoute) { 

    this.status = this.route.snapshot.paramMap.get('status')
  }

  ngOnInit() {
  }

}
