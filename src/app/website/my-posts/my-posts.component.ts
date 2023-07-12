import { Component, OnInit, Input, TemplateRef, ElementRef, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { ApiService } from 'src/app/services/api.service'

import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

import io from 'socket.io-client/dist/socket.io';

declare var $: any;

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {
  socket: io.Socket
  createPostForm: FormGroup
  createCommentForm: FormGroup
  createReplyForm: FormGroup
  groupId: string
  global_posts: any = []

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
    private alert: IAlertService
  ) {
    this.initializeCreateCommentForm()
    this.initializeCreateReplyForm()
  }

  urls = [];
  myFiles: string[] = [];
  videourl = ''
  myVideoFile = null

  onScroll(): void {
    console.log('scrolled')
  }

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

  submit(data: any) {
    if(this.api.user.id ==0){
      this.alert.error('Please signup')
      return
    }

    if (data.status === 'INVALID') {
      this.alert.error('Please fill out valid data in all fields and try again')

      return
    }
    const formData = this.api.jsonToFormData(data.value)
    formData.append("group_id", '0');
    for (var i = 0; i < this.myFiles.length; i++) {
      formData.append("post_images[]", this.myFiles[i]);
    }
    formData.append('post_video', this.myVideoFile)
    this.api.createGlobalPost(formData).subscribe((resp: any) => {
      this.global_posts.unshift({ ...resp.data, isShowMore: false, duration: 1 })
      this.alert.success('New Post created successfully')
      this.myForm = new FormGroup({
        post_content: new FormControl('', [Validators.required, Validators.minLength(3)]),
        post_images: new FormControl([], []),
        post_video: new FormControl(null, []),
      });
      this.myFiles = []
      this.urls = []
      this.removeVideo()
    })
  }

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

  createComment(index: any, data: any, post_id: any): boolean {
    if(this.api.user.id ==0){
      this.alert.error('Please signup')
      return
    }

    if (data.status === 'INVALID') {
      this.alert.error('Please fill out valid data in all fields a nd try again')
      return
    }
    const formData = this.api.jsonToFormData(data.value)
    formData.append('post_id', post_id)
    this.api.createGlobalComment(formData).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return false
      } else {
        this.global_posts[index].comment.push({ ...resp.data, duration: 1 });
        this.alert.success('New Comment created successfully')
        this.initializeCreateCommentForm()
      }
    })
  }

  createReply(postindex: any, cmtindex: any, data: any, post_id: any, cmt_id: any): boolean {
    if(this.api.user.id ==0){
      this.alert.error('Please signup')
      return
    }

    if (data.status === 'INVALID') {
      this.alert.error('Please fill out valid data in all fields a nd try again')
      return false
    }

    const formData = this.api.jsonToFormData(data.value)
    formData.append('post_id', post_id)
    formData.append('comment_id', cmt_id)
    
    this.api.createGlobalReply(formData).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return false
      } else {
        this.global_posts[postindex].comment[cmtindex].reply.push({ ...resp.data, duration: 1 });
        this.alert.success('New Reply created successfully')
        this.initializeCreateReplyForm()
      }
    })
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
    this.api.getGlobalPosts().subscribe((resp: any) => {
      this.global_posts = resp.data.map(post => ({
        ...post,
        isShowMore: false
      }))
    })

  }

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

  getKudoRank(id: any): any {
    let kudodata = [];
    const datas = this.global_posts[id].assessment;
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

  getCmtKudoRank(postindex: any, commentindex: any): any {
    let kudodata = [];
    const datas = this.global_posts[postindex].comment[commentindex].assessment;
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

  getReplyKudoRank(postindex: any, commentindex: any, replyindex: any): any {
    let kudodata = [];
    const datas = this.global_posts[postindex].comment[commentindex].reply[replyindex].assessment;
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

  postLikeFunc(index: any, postid: any, kudo: any): void {
    if(this.api.user.id ==0){
      this.alert.error('Please signup')
      return
    }

    const data = {
      post_id: postid,
      assessment_type: kudo
    }
    this.api.postGlobalLike(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        this.global_posts[index].assessment.push(resp.data)
        this.alert.success(kudo);
      }
    })
  }

  commentLike(postindex: any, cmtindex: any, commentid: any, kudo: any): void {
    if(this.api.user.id ==0){
      this.alert.error('Please signup')
      return
    }

    const data = {
      comment_id: commentid,
      assessment_type: kudo
    }
    this.api.commentGlobalLike(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        this.global_posts[postindex].comment[cmtindex].assessment.push(resp.data)
        this.alert.success(kudo);
      }
    })
  }

  replyLike(postindex: any, cmtindex: any, replyindex: any, replyid: any, kudo: any): void {
    if(this.api.user.id ==0){
      this.alert.error('Please signup')
      return
    }

    const data = {
      reply_id: replyid,
      assessment_type: kudo
    }
    this.api.replyGlobalLike(data).subscribe((resp: any) => {
      if (resp.success === false) {
        this.alert.error(resp.errors.general)
        return
      } else {
        this.global_posts[postindex].comment[cmtindex].reply[replyindex].assessment.push(resp.data)
        this.alert.success(kudo);
      }
    })
  }

  imageFileSelect() {
    $("#image_file").trigger("click");
  }

  videoFileSelect() {
    $("#video_file").trigger("click");
  }

  posts_more(){
    
  }
}

