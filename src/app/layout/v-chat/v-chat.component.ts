import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service'
import { Router, Params, ActivatedRoute } from '@angular/router';
import { LoginAuthService } from '../../services/authentication/loginauth.service';
import { LoginService } from '../../services/authentication/login.service';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'firebase/database';
import { database } from 'firebase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { error } from 'protractor';



// 6b8ef3c538b44702a8ed4ff602d1b70e
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc';

@Component({
  selector: 'app-v-chat',
  templateUrl: './v-chat.component.html',
  styleUrls: ['./v-chat.component.css']
})
export class VChatComponent implements OnInit {
  call_pk;
  msg=[];

  localStream: Stream;
  remoteCalls:any = [];
  errormessage;
  you;
  origin;
  
  chatid;
  uid;
  mid;
  lastmsgof_me;
  lastmsgof_you;
  egg_role;
  call_type;

  toggle = true;
  status = 'Enable';
  toggle1 = true;
  status1 = 'Enable'; 

  constructor(
    private LoginAuthService :LoginAuthService,
    private agoraService: AngularAgoraRtcService,
    private router: Router,
    private route: ActivatedRoute,
    public db: AngularFireDatabase,
    public firebaseService: FirebaseService,
    private StylistDesignerService: StylistDesignerService,
  ) { 
    this.agoraService.createClient();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      // document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.call_type = +params['call_type'];
    });
    this.route.params.subscribe(params => {
      // document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.origin = +params['origin'];
    });
    this.mid=localStorage.getItem('mid')
    this.uid = this.LoginAuthService.getUserData().user_id;
    var temp = this.mid.split('_')
    
    if(temp[0]==this.uid){
      this.chatid = temp[1]
    }
    else{
      this.chatid = temp[0]
    }
    this.egg_role = localStorage.getItem('egg_role');
    console.log('mid---------')
    console.log(this.mid)

    

    //----------------notification api call----------------------------
    if(this.origin==1){
      this.sendMessage()
      this.viewDetail()
      // this.getYou();
      var data = {
        notification_type: this.call_type.toString(),
        channel_name: this.mid,
        profile_pic_other: localStorage.getItem('lungiPic'),
        role: '1',
        caller_name: localStorage.getItem('lungiName'),
	      call_status: "True",
        timestamp: this.getCurrentDateTime(),
        call_pk: this.call_pk.toString()
      }
      console.log(data)
      this.StylistDesignerService.set_call_notification(data).subscribe(
        response => {                  
          console.log(response)
          var resp = this.startCall();
          console.log(resp)
        },
        error => {
          console.log(error)
          this.loginError(error.error.message);  
        }
      );
    }
    else if(this.origin==0){
      var resp = this.startCall();
      console.log(resp)
    }
  }

  // Add
  startCall() {
    if(this.call_type==2){
      this.agoraService.client.join('46222c22f3084bcda91eb1527073b665', this.mid, null, (uid) => {
        this.localStream = this.agoraService.createStream(uid, true, null, null, true, false);
        this.localStream.setVideoProfile('720p_3');
        this.subscribeToStreams();
      });
    }
    else if(this.call_type==1){
      this.agoraService.client.join('46222c22f3084bcda91eb1527073b665', this.mid, null, (uid) => {
        this.localStream = this.agoraService.createStream(uid, true, null, null, false, false);
        // this.localStream.setVideoProfile('720p_3');
        this.subscribeToStreams();
      });
    }
    
  }
  // Add
  private subscribeToStreams() {
    this.localStream.on("accessAllowed", () => {
      console.log("accessAllowed");
    });
    // The user has denied access to the camera and mic.
    this.localStream.on("accessDenied", () => {
      console.log("accessDenied");
    });

    this.localStream.init(() => {
      console.log("getUserMedia successfully");
      if(this.call_type==2){
        this.localStream.play('agora_local');
      }
      
      this.agoraService.client.publish(this.localStream, function (err) {
        console.log("Publish local stream error: " + err);
      });
      this.agoraService.client.on('stream-published', function (evt) {
        console.log("Publish local stream successfully");
      });
    }, function (err) {
      console.log("getUserMedia failed", err);
    });

    // Add
    this.agoraService.client.on('error', (err) => {
      console.log("Got error msg:", err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey("", () => {
          console.log("Renew channel key successfully");
        }, (err) => {
          console.log("Renew channel key failed: ", err);
        });
      }
    });

    // Add
    this.agoraService.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      this.agoraService.client.subscribe(stream, (err) => {
        console.log("Subscribe stream failed", err);
      });
    });

    // Add
    this.agoraService.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
    });

    // Add
    this.agoraService.client.on('stream-removed', (evt) => {
      const stream = evt.stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
      console.log(`Remote stream is removed ${stream.getId()}`);
    });

    // Add
    this.agoraService.client.on('peer-leave', (evt) => {
      const stream = evt.stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
        console.log(`${evt.uid} left from this channel`);
      }
    });
  }

  leave() {
    this.agoraService.client.leave(() => {
      this.localStream.stop();
      this.localStream.close();
      console.log("Leavel channel successfully");
      this.updateMessage();
      window.close();
      // this.router.navigate(['/i-chat']);

    }, (err) => {
      console.log("Leave channel failed");
    });
  }
  mute(){
    if(this.toggle){
      this.localStream.muteAudio();
    }
    else{
      this.localStream.unmuteAudio();
    }
    this.toggle = !this.toggle;
    this.status = this.toggle ? 'Enable' : 'Disable';
  }
  // unmute(){
  //   this.localStream.unmuteAudio();
  // }
  dvideo(){
    if(this.toggle1){
      this.localStream.disableVideo()
    }
    else{
      this.localStream.enableVideo()
    }
    this.toggle1 = !this.toggle1;
    this.status1 = this.toggle1 ? 'Enable' : 'Disable';
  }
  // evideo(){
  //   this.localStream.enableVideo();
  // }

  //get date
  getCurrentDateTime(){
    return new Date().getTime();
  }
  //send message related
  sendMessage(){
    console.log('hello')
    
    let d = this.getCurrentDateTime()
    var data;
    var content;
    if(this.call_type==1){
      content = '--Audio call conducted--'
    }
    if(this.call_type==2){
      content = '--Video call conducted--'
    }
    data = {
      'content':content,
      'from':this.uid,
      'key':'CALLING',
      'latitude':0,
      'longitude':0,
      'selected':false,
      'status':'0',
      'timestamp':d,
      'to':this.chatid,
      'type':'call'
    }

    let itemsRef = this.db.list('messages/'+this.mid);
    let res = itemsRef.push(data);
    this.call_pk = res['key']
    
    // console.log(res)
    // console.log(res['key'])

    this.getLastMsgOfMe()
    this.getLastMsgOfYou()

    let mylastmsgcount=0;
    let yourlastmsgcount=0;
    if(this.lastmsgof_me){
      mylastmsgcount = + this.lastmsgof_me['unread_count']
    }
    if(this.lastmsgof_you){
      yourlastmsgcount = +this.lastmsgof_you['unread_count']
    }
    mylastmsgcount+=1
    yourlastmsgcount+=1

    data={
      'last_message_location':res['key'],//need to set here
      'last_message_timestamp':d,
      'role':'1',
      'unread_count':mylastmsgcount
    }

    if(this.lastmsgof_me){
      itemsRef = this.db.list('conversation/user_'+this.uid);
      itemsRef.update(this.mid,data);
    }
    else{
      let itemsRef = this.db.object('conversation/user_'+this.uid+'/'+this.mid);
      itemsRef.set(data);
    }

    data={
      'last_message_location':res['key'],
      'last_message_timestamp':d,
      'role':this.egg_role,
      'unread_count':yourlastmsgcount
    }
    if(this.lastmsgof_you){
      itemsRef = this.db.list('conversation/user_'+this.chatid);
      itemsRef.update(this.mid,data);
    }
    else{
      let itemsRef = this.db.object('conversation/user_'+this.chatid+'/'+this.mid);
      itemsRef.set(data);
    }
  }
  updateMessage(){
    var data={
      key:'DISCONNECTED'
    }
    var itemsRef = this.db.list('messages/'+this.mid);
    if(itemsRef){
      itemsRef.update(this.call_pk,data);
    }
  }
  getYou(){
    this.db.list("users/user_"+this.chatid).valueChanges().subscribe(
      data => {
        // this.you = data;
        this.you = {
          'id':data[0],
          'isOnline':data[1],
          'name':data[2],
          'profilePic':data[3],
          'role':data[4],
        };
        console.log(data)
        console.log(this.you);
        return data;
    },error=>{
      console.log(error)
    });
  }
  getLastMsgOfMe(){
    this.lastmsgof_me = '';
    this.db.list("conversation/user_"+this.uid+'/'+this.mid).valueChanges().subscribe(
      data => {
        this.lastmsgof_me = data
    });
  }
  getLastMsgOfYou(){
    this.lastmsgof_you='';
    this.db.list("conversation/user_"+this.chatid+'/'+this.mid).valueChanges().subscribe(
      data => {
        this.lastmsgof_you = data
    });
  }
  viewDetail(){
    // #show all data
    this.db.list("messages/"+this.mid+"/"+this.call_pk).valueChanges().subscribe(
      data => {
        this.msg = data
        console.log(this.msg)
    });
  }
  loginError(e) {
    console.log(e);
    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }
}
