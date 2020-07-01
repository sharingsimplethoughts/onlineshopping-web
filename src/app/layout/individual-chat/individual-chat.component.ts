import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service'
import { Router, Params } from '@angular/router';
import { LoginAuthService } from '../../services/authentication/loginauth.service';
import { LoginService } from '../../services/authentication/login.service';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'firebase/database';
import { database } from 'firebase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { error } from 'protractor';



// import { exists } from 'fs';
declare var $:any;
declare var $: any;
declare var swal:any;

@Component({
  selector: 'app-individual-chat',
  templateUrl: './individual-chat.component.html',
  styleUrls: ['./individual-chat.component.css']
})
export class IndividualChatComponent implements OnInit {
  profileimg;
  

  msgs;
  mid;
  myInput;
  myfileurl;
  mtype;
  lastmsgof_me;
  lastmsgof_you;
  you;
  me;
  uid;
  uname;
  chatid;
  egg_role;
  item_to_show:any;

  constructor(
    public db: AngularFireDatabase,
    private LoginAuthService :LoginAuthService,
    public firebaseService: FirebaseService,
    private router: Router,
    private formBuilder: FormBuilder, 
    private LoginService: LoginService
  ) { 
    
  }


  ngOnInit() {
    if(!this.LoginAuthService.getUserData()){
      swal('Please login to access chat',)
      this.router.navigate(['/login/']);
    }
    this.uid = this.LoginAuthService.getUserData().user_id;
    let fname = this.LoginAuthService.getUserData().firstname;
    let lname = this.LoginAuthService.getUserData().lastname;
    this.uname = fname + ' '+ lname
    this.chatid = localStorage.getItem('chatid');
    this.egg_role = localStorage.getItem('egg_role');
    this.profileimg = localStorage.getItem('profileimg') //this logged in users profile pic which is saved just after logged in

    this.uid = +this.uid
    this.chatid = +this.chatid
    console.log(this.uid)
    console.log(this.chatid)
    if(this.chatid<this.uid){
      console.log('inside if of mid')
      this.mid=this.chatid+'_'+this.uid
    }
    else{
      console.log('inside else of mid')
      this.mid=this.uid+'_'+this.chatid
    }
    console.log(this.mid)
    localStorage.setItem('mid',this.mid);
    // localStorage.setItem('mid',this.mid);
    
    this.getMe(); //updateMe() is getting called from inside of getMe()
    this.getYou();
    this.viewDetail();

    $('#action_menu_btn').click(function(){
      $('.action_menu').toggle();
    });
    
    setTimeout(()=>{
      $('.msg_card_body').animate({scrollTop: $('.msg_contailner').height()},40);
    },1500);
  }

//get date
  getCurrentDateTime(){
    // let d = new Date()
    // let date = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear();
    // let time = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    // let datetime = date+'('+time+')';
    // return datetime;
    return new Date().getTime();
  }
  
//upload image and get url
  singleFiles(e){
    const file = e.target.files[0]
    console.log(file)
    if(file.size>1000000000){
      swal("File Size Exceeded", "Please upload files of maximum 10mb in size.", "error");
      return false;
    }
  
    let formData:FormData = new FormData();
    formData.append('file', file, file.name);

    this.LoginService.upload_chat_file(formData).subscribe(response=>{
      console.log(response);
      this.myfileurl = environment.baseUrl+response['url'];
      let gfile_type = file.type.toLowerCase()
      if(gfile_type.includes('image')){
        this.sendMessage(0)
      }
      else if(gfile_type.includes('video')){
        this.sendMessage(1)
      }
      else if(gfile_type.includes('application')){
        this.sendMessage(2)
      }
    },error=>{
      swal("Error", error, "error");
    });

    
  }
//update my online status
  createMe(){
    console.log('inside create')
    console.log(this.profileimg)
    var data = {
      id:this.uid,
      isOnline:true,
      name: this.uname,
      profilePic:this.profileimg,
      role:'1'
    }
    let itemRef = this.db.object('users/user_'+this.uid);
    itemRef.set(data);
    this.db.list("users/user_"+this.uid).valueChanges().subscribe(
      data => {
        this.me = data;
    },error=>{
      console.log(error)
    });
  }
  updateMe(){
    console.log('inside update')
    let d = this.getCurrentDateTime();
    let itemsRef = this.db.list('users/');
    var data1 = {
      id:this.uid,
      isOnline:true,
      name:this.me['name'],
      profilePic:this.me['profilePic'],
      role:this.me['role']
    }
    itemsRef.update('user_'+this.uid, data1);
  }

//get mine & yours online status
  getMe(){
    this.db.list("users/user_"+this.uid).valueChanges().subscribe(
      data => {
        console.log('initializing this.me')
        // this.me = data;
        this.me = {
          'id':data[0],
          'isOnline':data[1],
          'name':data[2],
          'profilePic':data[3],
          'role':data[4],
        };
        console.log(this.me.length)
    },error=>{
      console.log(error)
    });
    setTimeout(()=>{
      if(this.me.length!=0){
        this.updateMe()
      }
      else{
        this.createMe();
      }
    },1500);
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
        localStorage.setItem('lungiPic',this.you['profilePic'])
        localStorage.setItem('lungiName',this.you['name'])
        return data;
    },error=>{
      console.log(error)
    });
  }

//message list
  viewDetail(){
    // #show all data
    this.db.list("messages/"+this.mid).valueChanges().subscribe(
      data => {
        this.msgs = data
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


//send message related
  sendMessage(mtype){
    
      console.log('hello')
      this.mtype=mtype
      let d = this.getCurrentDateTime()
      var data;
      if(mtype==0){
        data = {
          'content':this.myfileurl,
          'from':this.uid,
          'key':'',
          'latitude':0,
          'longitude':0,
          'selected':false,
          'status':'0',
          'timestamp':d,
          'to':this.chatid,
          'type':'image'
        }
      }
      else if(mtype==1){
        data = {
          'content':this.myfileurl,
          'from':this.uid,
          'key':'',
          'latitude':0,
          'longitude':0,
          'selected':false,
          'status':'0',
          'timestamp':d,
          'to':this.chatid,
          'type':'video'
        }
      }
      else if(mtype==2){
        data = {
          'content':this.myfileurl,
          'from':this.uid,
          'key':'',
          'latitude':0,
          'longitude':0,
          'selected':false,
          'status':'0',
          'timestamp':d,
          'to':this.chatid,
          'type':'application'
        }
      }
      else if(mtype==3){
        this.myInput = this.myInput.trim()
        if(this.myInput){
            data = {
              'content':this.myInput,
              'from':this.uid,
              'key':'',
              'latitude':0,
              'longitude':0,
              'selected':false,
              'status':'0',
              'timestamp':d,
              'to':this.chatid,
              'type':'text'
            }
          }
      }

      let itemsRef = this.db.list('messages/'+this.mid);
      let res = itemsRef.push(data);

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
      
      this.myInput='';
      this.myfileurl='';

      setTimeout(()=>{
        $('.msg_card_body').animate({scrollTop: $('.msg_contailner').height()});
      },50);
    // }
  }
  handleSubmit(event){
    if(event.keyCode === 13){
      this.sendMessage(3);
    }
  }


}
