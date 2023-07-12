import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,  } from '@angular/router'

@Component({
  selector: 'app-claim-status',
  templateUrl: './claim-status.component.html',
  styleUrls: ['./claim-status.component.css']
})
export class ClaimStatusComponent implements OnInit {
    status = ''
  constructor(private route: ActivatedRoute) { 

    this.status = this.route.snapshot.paramMap.get('status')
  }

  ngOnInit() {
  }

}
