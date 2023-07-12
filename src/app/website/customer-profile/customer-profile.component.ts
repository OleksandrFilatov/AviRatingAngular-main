import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { ActivatedRoute } from '@angular/router';
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
  airport_name: any
  customer_posts: any = []
  customer_replies: any = []
  customer_likes: any = []
  customer_airparks: any = []
  customer_medias: any = []
  reviewsList: any = []


  customer_id: any
  customer_first_name: any
  customer_last_name: any
  customer_info: any
  customer_aircraft_type: any
  customer_aircraft_tail_number: any
  customer_dob: any
  customer_address: any
  customer_contact_1: any
  customer_contact_2: any
  posts_cnt: any
  replies_cnt: any
  likes_cnt: any
  tab_state: any

  post_page: number = 1
  reply_page: number = 1
  like_page: number = 1
  airpark_page: number = 1
  review_page: number = 1

  post_more: boolean = true
  reply_more: boolean = true
  like_more: boolean = true
  airpark_more: boolean = true
  review_more: boolean = true

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    private alert: IAlertService,
    private router: Router,

  ) {

  }

  ngOnInit(): void {

    this.customer_id = this.route.snapshot.paramMap.get('customer_id')

    this.api.getCustomerInfo({ customer_id: this.customer_id }).subscribe((resp: any) => {
      this.customer_info = resp.data
      this.customer_first_name = this.customer_info.first_name
      this.customer_last_name = this.customer_info.last_name
      this.customer_aircraft_type = this.customer_info.aircraft_type
      this.customer_aircraft_tail_number = this.customer_info.aircraft_tail_number
      // this.customer_dob = this.customer_info.dob
      this.customer_address = this.customer_info.address
      this.customer_contact_1 = this.customer_info.contact_1
      this.customer_contact_2 = this.customer_info.contact_2
      this.tab_state = 1;

      this.api.getAirportName({ airport_id: this.customer_info.home_airport }).subscribe((resp: any) => {
        this.airport_name = resp.data
      })
    })

    this.api.getActivityInfo({ customer_id: this.customer_id }).subscribe((resp: any) => {
      this.posts_cnt = resp.data.posts_cnt
      this.replies_cnt = resp.data.replies_cnt
      this.likes_cnt = resp.data.likes_cnt
    })

    this.api.getCustomerPosts({ customer_id: this.customer_id, page: this.post_page }).subscribe((resp: any) => {
      this.customer_posts = resp.data
      if (this.customer_posts.length < 5)
        this.post_more = false
    })

    this.api.getCustomerReplies({ customer_id: this.customer_id, page: this.reply_page }).subscribe((resp: any) => {
      this.customer_replies = resp.data
      if (this.customer_replies.length < 5)
        this.reply_more = false
    })

    this.api.getCustomerLikes({ customer_id: this.customer_id, page: this.like_page }).subscribe((resp: any) => {
      this.customer_likes = resp.data
      if (this.customer_likes.length < 5)
        this.like_more = false
    })

    this.api.getCustomerLikes({ customer_id: this.customer_id, page: this.like_page }).subscribe((resp: any) => {
      this.customer_likes = resp.data
      if (this.customer_likes.length < 5)
        this.like_more = false
    })

    this.api.getCustomerAirparks({ customer_id: this.customer_id, page: this.like_page }).subscribe((resp: any) => {
      this.customer_airparks = resp.data
      if (this.customer_airparks.length < 5)
        this.airpark_more = false
    })

    this.api.getCustomerMedias({ customer_id: this.customer_id, page: this.like_page }).subscribe((resp: any) => {

      for (let i = 0; i < resp.data.length; i++) {

        if (resp.data[i].image_cnt > 0) {
          for (let j = 1; j <= resp.data[i].image_cnt; j++) {

            this.customer_medias.push({ 'post_id': resp.data[i].id, 'post_content': resp.data[i].post_content, 'image_name': resp.data[i].id + '_' + j, 'type': 'image' })
          }
        }
        if (resp.data[i].video_cnt > 0) {
          this.customer_medias.push({ 'post_id': resp.data[i].id, 'post_content': resp.data[i].post_content, 'video_name': resp.data[i].id, 'type': 'video' })
        }
      }

    })

    this.api.getCustomerBusinessReviews({ customer_id: this.customer_id, page: this.review_page }).subscribe((resp: any) => {
      if (resp.success === true) {
        this.reviewsList = resp.data
        if (this.reviewsList.length < 5)
          this.review_more = false
        console.log(this.review_more)
      } else {
        this.reviewsList = []
      }
    })
  }


  getUserImageUrl(data: any): string {
    return this.api.baseUrl + '/profile-image/' + data
  }

  getPostImageUrl(data: any): string {
    return this.api.baseUrl + '/post-img-thumb/' + data
  }

  getPostVideoUrl(data: any): string {
    return this.api.baseUrl + '/post-video-thumb/' + data
  }

  transform(differencevalue: any): any {
    if (differencevalue) {
      // const seconds = Math.floor((+new Date() - +new Date(differencevalue)) / 1000);
      if (differencevalue < 10) // less than 30 seconds ago will show as 'Just now'
        return 'Just now';
      const intervals = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(differencevalue / intervals[i]);
        if (counter > 0)
          if (counter === 1) {
            return counter + ' ' + i + ' ago';
          } else {
            return counter + ' ' + i + 's ago';
          }
      }
    }
    return differencevalue;
  }

  posts_more() {
    this.post_page++;
    this.api.getCustomerPosts({ customer_id: this.customer_id, page: this.post_page }).subscribe((resp: any) => {
      this.customer_posts = this.customer_posts.concat(resp.data);

      if (resp.data.length < 5)
        this.post_more = false
    })
  }

  replies_more() {
    this.reply_page++;
    this.api.getCustomerReplies({ customer_id: this.customer_id, page: this.reply_page }).subscribe((resp: any) => {
      this.customer_replies = this.customer_replies.concat(resp.data);

      if (resp.data.length < 5)
        this.reply_more = false
    })
  }

  likes_more() {
    this.like_page++
    this.api.getCustomerLikes({ customer_id: this.customer_id, page: this.like_page }).subscribe((resp: any) => {
      this.customer_likes = this.customer_likes.concat(resp.data);

      if (resp.data.length < 5)
        this.like_more = false
    })
  }

  airparks_more() {
    this.airpark_page++
    this.api.getCustomerAirparks({ customer_id: this.customer_id, page: this.like_page }).subscribe((resp: any) => {
      this.customer_airparks = this.customer_airparks.concat(resp.data);
      if (this.customer_airparks.length < 5)
        this.airpark_more = false
    })
  }

  addFriend(customer_id: any) {
    const data = {
      customer_id: customer_id
    }
    this.api.friendRequest(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return false
      } else {
        // this.nearGroupList[index].state = 'in progress'
        // this.sendRequest(resp.data)
        this.alert.success(resp.msg)
      }
    })
  }

  joinRequest(groupid: any, index: any) {
    const data = {
      group_id: groupid
    }
    this.api.requestJoin(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return false
      } else {
        this.customer_airparks[index].state = 'in progress'
        //this.sendRequest(resp.data)
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

  getGroupImageUrl(data: any): string {
    return this.api.baseUrl + '/group-image/' + data
  }

  signup_alert() {
    this.alert.error('Please sign up to add Airparks')
  }


}
