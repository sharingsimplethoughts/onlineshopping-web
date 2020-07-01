import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    public db: AngularFireDatabase
  ) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        localStorage.setItem('device_token',token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  mid;
  callpk;
  audio = new Audio();
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        // console.log(payload['data'])
        // var j = JSON.parse(payload['data']);
        var j = payload['data'];
        this.currentMessage.next(j);
        localStorage.setItem('callNotification_callType',j['notification_type']);
        localStorage.setItem('callNotification_channelName',j['channel_name']);
        localStorage.setItem('callNotification_callpk',j['call_pk']);
        this.mid = j['channel_name'];
        this.callpk = j['call_pk'];
        // console.log('*******************');
	      // console.log(payload['data']['misc']);
        // console.log(j);
        // console.log(j['notification_type']);
        document.getElementById('showNotification').style.display='inline-block';
        // document.getElementById('img').setAttribute( 'src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==' );
        document.getElementById('showNotPic').setAttribute('src',"http://mysite"+j['profile_pic_other']);
        this.playAudio();
        setTimeout(()=>{
          document.getElementById('showNotification').style.display='none';
          this.updateMessage();
          // this.pauseAudio();
        },30000);
	     
      })
  }
  updateMessage(){
    var data={
        key:'REJECTED'
      }
    var itemsRef = this.db.list('messages/'+this.mid);
    if(itemsRef){
      itemsRef.update(this.callpk,data);
    }
  }
  playAudio(){
    this.audio.src = "assets/img/1313.wav";
    this.audio.load();
    this.audio.play();
  }
  // pauseAudio(){
  //   this.audio.pause();
  // }
}
