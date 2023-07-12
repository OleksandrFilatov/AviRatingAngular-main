import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { SocketsService } from 'src/app/services/sockets.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'


declare var $: any;

@Component({
  selector: 'app-customer-post',
  templateUrl: './customer-post.component.html',
  styleUrls: ['./customer-post.component.css']
})
export class CustomerPostComponent implements OnInit {

  createPostForm: FormGroup
  createCommentForm: FormGroup
  createReplyForm: FormGroup
  groupId: any
  post_id: any
  user_id: any
  image_cnt: any
  video_cnt: any
  post_content: string
  post_content_length: any
  duration: any
  user: any
  first_name: any
  last_name: any
  customer_post: any
  isShowMore = false
  comment = []
  assessment = []

  kudoList: any = [
    {
      content: 'Like',
      source: '/assets/images/mood-Like.svg'
    },
    {
      content: 'Thank',
      source: '/assets/images/mood-Thank.svg'
    },
    {
      content: 'Agree',
      source: '/assets/images/mood-Agree.svg'
    },
    {
      content: 'Haha',
      source: '/assets/images/mood-Haha.svg'
    },
    {
      content: 'Wow',
      source: '/assets/images/mood-Wow.svg'
    },
    {
      content: 'Sad',
      source: '/assets/images/mood-Sad.svg'
    }
  ]
  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public socketService: SocketsService,
    private alert: IAlertService,
    public route: ActivatedRoute

  ) {
    this.initializeCreateCommentForm()
    this.initializeCreateReplyForm()
  }
  urls = [];
  myFiles: string[] = [];
  videourl = ''
  myVideoFile = null

  myForm = new FormGroup({
    post_content: new FormControl('', [Validators.required, Validators.minLength(3)]),
    post_images: new FormControl([], []),
    post_video: new FormControl(null, []),
  });

  removeImage(i) {
    this.myFiles.splice(i, 1);
    this.urls.splice(i, 1);
  }

  removeVideo() {
    this.myVideoFile = null;
    this.videourl = '';
  }

  onFileChange(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.urls.push(event.target.result);
      }
      reader.readAsDataURL(event.target.files[i]);
      this.myFiles.push(event.target.files[i]);
    }
  }

  onVideoChange(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.videourl = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.myVideoFile = event.target.files[0];
    }
  }

  // submit(data: any) {
  //   if(this.api.user.id ==0){
  //     this.alert.error('Please signup to post')
  //     return
  //   }
  //   if (data.status === 'INVALID') {
  //     this.alert.error('Please fill out valid data in all fields and try again')
  //     return
  //   }
  //   const formData = this.api.jsonToFormData(data.value)
  //   formData.append("group_id", this.groupId);
  //   for (var i = 0; i < this.myFiles.length; i++) {
  //     formData.append("post_images[]", this.myFiles[i]);
  //   }
  //   formData.append('post_video', this.myVideoFile)
  //   this.api.createPost(formData).subscribe((resp: any) => {
  //     if (resp.success === false) {
  //       this.alert.error(resp.errors.general)
  //     } else {
  //       this.group_posts.unshift({ ...resp.data, isShowMore: false, duration: 1 })
  //       this.alert.success('New Post created successfully')
  //       // this.sendPost({ ...resp.data, isShowMore: false, duration: 1 })
  //       this.myForm = new FormGroup({
  //         post_content: new FormControl('', [Validators.required, Validators.minLength(3)]),
  //         post_images: new FormControl([], []),
  //         post_video: new FormControl(null, []),
  //       });
  //       this.myFiles = []
  //       this.urls = []
  //       this.removeVideo()
  //     }
  //   })
  // }

  initializeCreateCommentForm() {
    this.createCommentForm = this.fb.group({
      comment_content: new FormControl(null, [Validators.required]),
    })
  }

  initializeCreateReplyForm() {
    this.createReplyForm = this.fb.group({
      reply_content: new FormControl(null, [Validators.required]),
    })
  }

  createComment(data: any, post_id: any): void {
    if (this.api.user.id == 0) {
      this.alert.error('Please signup')
      return
    }

    if (data.status === 'INVALID') {
      this.alert.error('Please fill out valid data in all fields a nd try again')
      return
    }
    const formData = this.api.jsonToFormData(data.value)
    formData.append("group_id", this.groupId);
    formData.append('post_id', post_id)
    this.api.createComment(formData).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
      } else {
        if (resp.success === false) {
          this.alert.error(resp.errors.general)
          return
        } else {
          const data = { ...resp.data, duration: 1 };
          this.comment.push(data);
          // this.sendComment({ data: data, index: index, group_id: this.groupId });
          this.alert.success('New Comment is created successfully')
          this.initializeCreateCommentForm()
        }
      }
    })
  }

  createReply(cmtindex: any, data: any, post_id: any, cmt_id: any): void {
    if (this.api.user.id == 0) {
      this.alert.error('Please signup')
      return
    }

    if (data.status === 'INVALID') {
      this.alert.error('Please fill out valid data in all fields a nd try again')
      return
    }

    const formData = this.api.jsonToFormData(data.value)
    formData.append("group_id", this.groupId);
    formData.append('post_id', post_id)
    formData.append('comment_id', cmt_id)
    this.api.createReply(formData).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        const data = { ...resp.data, duration: 1 };
        this.comment[cmtindex].reply.push(data);
        this.toggleShowReplyAdd(cmt_id)
        this.alert.success('New Reply created successfully')
        // this.sendReply({ data: data, postindex: postindex, commentindex: cmtindex, group_id: this.groupId })
        this.initializeCreateReplyForm()
      }
    })
  }

  toggleShowReplyAdd(commentid: any): any {
    if ($('.create-reply-form' + commentid).hasClass('d-none')) {
      $('.create-reply-form' + commentid).removeClass('d-none')
      $('.create-reply-form' + commentid).fadeIn(3000);
    }
    else {
      $('.create-reply-form' + commentid).addClass('d-none')
      $('.create-reply-form' + commentid).fadeOut(3000);
    }
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

  ngOnInit(): void {
    this.post_id = this.route.snapshot.paramMap.get('post_id')
    const params = {
      post_id: this.post_id
    }
    this.api.getCustomerPost(params).subscribe((resp: any) => {
      this.groupId = resp.data.group_id;
      this.customer_post = resp.data
      this.comment = this.customer_post.comment
      this.assessment = this.customer_post.assessment
      this.user_id = this.customer_post.user_id
      this.duration = this.customer_post.duration
      this.image_cnt = this.customer_post.image_cnt
      this.video_cnt = this.customer_post.image_cnt
      this.post_content = this.customer_post.post_content
      this.post_content_length = this.customer_post.post_content.length
      this.first_name = this.customer_post.user.first_name
      this.last_name = this.customer_post.user.last_name
    })


    // this.socketService.socket.on('new_comment', (data) => {
    //   if (this.groupId == data.group_id) {
    //     this.group_posts[data.index].comment.push(data.data);
    //     this.alert.success('New comment is created.')
    //     this.api.newNotification++
    //   }
    // })
    // this.socketService.socket.on('new_reply', (data) => {
    //   if (this.groupId == data.group_id) {
    //     this.group_posts[data.postindex].comment[data.commentindex].reply.push(data.data);
    //     this.alert.success('New reply is created.')
    //     this.api.newNotification++
    //   }
    // })

    // this.socketService.socket.on('new_post_like', (data) => {
    //   if (this.groupId == data.group_id) {
    //     this.group_posts[data.index].assessment.push(data.data);
    //     this.api.newNotification++
    //   }
    // })

    // this.socketService.socket.on('new_comment_like', (data) => {
    //   if (this.groupId == data.group_id) {
    //     this.group_posts[data.postindex].comment[data.commentindex].assessment.push(data.data);
    //     this.api.newNotification++
    //   }
    // })

    // this.socketService.socket.on('new_reply_like', (data) => {
    //   if (this.groupId == data.group_id) {
    //     this.group_posts[data.postindex].comment[data.commentindex].reply[data.replyindex].assessment.push(data.data);
    //     this.api.newNotification++
    //   }
    // })
  }


  // sendComment(commentdata: any) {
  //   this.socketService.socket.emit('send_comment', commentdata);
  // }

  // sendReply(replydata: any) {
  //   this.socketService.socket.emit('send_reply', replydata);
  // }

  // sendCommentLike(commentlikedata: any) {
  //   this.socketService.socket.emit('send_comment_like', commentlikedata);
  // }

  // sendReplyLike(replylikedata: any) {
  //   this.socketService.socket.emit('send_reply_like', replylikedata);
  // }

  getGroupImageUrl(data: any): string {
    return this.api.baseUrl + '/group-image/' + data
  }

  getUserImageUrl(data: any): string {
    return this.api.baseUrl + '/profile-image/' + data
  }

  getSliderObject(cnt: any, postid: any): any {
    let imageObject = [];
    for (let i = 1; i < parseInt(cnt) + 1; i++) {
      const temp = this.api.baseUrl + '/post-image/' + postid + '_' + i;
      imageObject.push(temp);
    }
    return imageObject;
  }


  getVideoUrl(postid: any): any {
    return this.api.baseUrl + '/post-video/' + postid;
  }

  getKudoRank(): any {
    let kudodata = [];
    const datas = this.assessment;
    for (let i = 0; i < this.kudoList.length; i++) {
      const temp = {
        content: this.kudoList[i].content,
        cnt: datas.filter(data => data.assessment_type == this.kudoList[i].content).length
      }
      kudodata.push(temp);
    }
    kudodata.sort(function (a, b) { return b.cnt - a.cnt }).splice(3, 3);
    kudodata = kudodata.filter(data => data.cnt > 0).map(data => "/assets/images/mood-" + data.content + ".svg");
    return kudodata;
  }

  getCmtKudoRank(commentindex: any): any {
    let kudodata = [];
    const datas = this.comment[commentindex].assessment;
    for (let i = 0; i < this.kudoList.length; i++) {
      const temp = {
        content: this.kudoList[i].content,
        cnt: datas.filter(data => data.assessment_type == this.kudoList[i].content).length
      }
      kudodata.push(temp);
    }
    kudodata.sort(function (a, b) { return b.cnt - a.cnt }).splice(3, 3);
    kudodata = kudodata.filter(data => data.cnt > 0).map(data => "/assets/images/mood-" + data.content + ".svg");
    return kudodata;
  }

  getReplyKudoRank(commentindex: any, replyindex: any): any {
    let kudodata = [];
    const datas = this.comment[commentindex].reply[replyindex].assessment;
    for (let i = 0; i < this.kudoList.length; i++) {
      const temp = {
        content: this.kudoList[i].content,
        cnt: datas.filter(data => data.assessment_type == this.kudoList[i].content).length
      }
      kudodata.push(temp);
    }
    kudodata.sort(function (a, b) { return b.cnt - a.cnt }).splice(3, 3);
    kudodata = kudodata.filter(data => data.cnt > 0).map(data => "/assets/images/mood-" + data.content + ".svg");
    return kudodata;
  }

  postLikeFunc(postid: any, kudo: any): void {
    if (this.api.user.id == 0) {
      this.alert.error('Please signup')
      return
    }
    const data = {
      post_id: postid,
      assessment_type: kudo,
      group_id: this.groupId
    }
    this.api.postLike(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        const temp = resp.data;
        this.assessment.push(temp)
        // this.sendPostLike({ data: temp, index: index, group_id: this.groupId });
      }
    })
  }

  commentLike(cmtindex: any, commentid: any, kudo: any): void {
    if (this.api.user.id == 0) {
      this.alert.error('Please signup')
      return
    }
    const data = {
      comment_id: commentid,
      assessment_type: kudo,
      group_id: this.groupId
    }
    this.api.commentLike(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        const temp = resp.data
        this.comment[cmtindex].assessment.push(temp)
        // this.sendCommentLike({ data: data, group_id: this.groupId, postindex: postindex, commentindex: cmtindex })
      }
    })
  }

  replyLike(cmtindex: any, replyindex: any, replyid: any, kudo: any): void {
    if (this.api.user.id == 0) {
      this.alert.error('Please signup')
      return
    }
    const data = {
      reply_id: replyid,
      assessment_type: kudo,
      group_id: this.groupId
    }
    this.api.replyLike(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        const temp = resp.data
        this.comment[cmtindex].reply[replyindex].assessment.push(resp.data)
        // this.sendReplyLike({ data: data, group_id: this.groupId, postindex: postindex, commentindex: cmtindex, replyindex: replyindex })
      }
    })
  }

  imageFileSelect() {
    $("#image_file").trigger("click");
  }

  videoFileSelect() {
    $("#video_file").trigger("click");
  }
}
