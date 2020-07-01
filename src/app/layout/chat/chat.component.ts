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
import {FormsModule} from '@angular/forms';
import { environment } from '../../../environments/environment';
import {Http, Response, RequestOptions, Headers} from '@angular/http';


// import { exists } from 'fs';
declare var $:any;
declare var $: any;
declare var swal:any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  itemsRef: AngularFireList<any>;
  items1: Observable<any[]>;
  msgs;
  mid;

  isHiddenNewMsg={};
  isHiddenMsgDetail=true;
  myInput;
  myFile : File;
  myfileurl;
  myFileNew;
  mtype;

  user_type;
  mySearInput;
  newMsgCount=0;
  

  you;
  me;
  res;
  uid;
  clicked_id;
  searchValue: string = "";
  items: Array<any>;
  name_filtered_items: Array<any>;
  temp_items: Array<any>;
  temp_name_filtered_items: Array<any>;
  
  constructor(
    public db: AngularFireDatabase,
    private LoginAuthService :LoginAuthService,
    public firebaseService: FirebaseService,
    private router: Router,
    private LoginService: LoginService
  ) { }

  ngOnInit() {
    if(!this.LoginAuthService.getUserData()){
      swal('Please login to access chat',)
      this.router.navigate(['/login/']);
    }
    this.uid = this.LoginAuthService.getUserData().user_id;
    this.user_type = localStorage.getItem('temporary_user_type')
    if(!this.user_type){
      swal('Please choose stylist or designer.',)
      this.router.navigate(['/']);
    }
    
    $('#action_menu_btn').click(function(){
      $('.action_menu').toggle();
    });
    
    this.getMe();
    this.updateMe();
    this.getData();
    
  }
  ngAfterViewInit(){
    // New Message Count
    this.showNewMsg()
  }

  
  //get date
  getCurrentDateTime(){
    let d = new Date()
    let date = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear();
    let time = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    let datetime = date+'('+time+')';
    return datetime;
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
  
  
  //new message
  showNewMsg(){
    this.db.list("LastMsgs").valueChanges().subscribe(
      data => {
        for(let m in data){
          let d: any = data[m]
          if(d['to']==this.uid && d['count']=='1'){
            for(let n in this.items){
              if(this.items[n]['id']==d['from']){
                this.items[n]['newMsg']='1'
                this.isHiddenNewMsg[this.items[n]['id']]=1;
                // document.getElementById("newMsg"+this.items[n]['id']).style.display = "inline-block"
                // this.lungi
              }
              else{
                this.isHiddenNewMsg[this.items[n]['id']]=0;
                // this.isHiddenNewMsg=false
                // let k = document.getElementById("newMsg"+this.items[n]['id']).style.display = "none"
              }
            }
          }
        }
      }
    );
    console.log(this.items)
  }
  hideNewMsg(){
    let data={
      from:this.clicked_id,
      to:this.uid,
      count:0
    }
    let itemsRef = this.db.list('LastMsgs/');
    itemsRef.update(this.mid,data);
    let e = document.getElementById('newMsg'+this.clicked_id)
    if(e){
      e.style.display = "none"
    }
  }
  
  
  //user list
  getData(){
    this.uid = this.LoginAuthService.getUserData().user_id;
    // Find User List - bohot khatarnak logic he. mujhe vi nehi pata kese ban gaya. delete mat karna.
    this.items=[]
    this.name_filtered_items=[]
    this.db.list("Users").valueChanges().subscribe(
      data => {
        let count=0;
        for(let m in data){
          let d: any = data[m]
          for(let x in d){
            if(data[m][x]['id']!=this.uid){
              this.items[count]=data[m][x]
              this.items[count]['newMsg']='0'
              this.name_filtered_items[count]=data[m][x]
              count++;
            }
          }
        }
      }
    );
    
  }
  
  
  //message list
  viewDetail(clicked_id){
    this.uid = this.LoginAuthService.getUserData().user_id;
    this.clicked_id = clicked_id;
    if(clicked_id<this.uid){
      this.mid=clicked_id+'_'+this.uid
    }
    else{
      this.mid=this.uid+'_'+clicked_id
    }
    // #show all data
    this.db.list("Msgs/"+this.mid).valueChanges().subscribe(
      data => {
        this.msgs = data
    });
    this.db.list("Users/"+this.clicked_id).valueChanges().subscribe(
      data => {
        this.you = data
    });
    this.isHiddenMsgDetail=false;
    // Remove newMsg count
    this.hideNewMsg()
  }
  
  
  //me related
  getMe(){
    this.db.list("Users/"+this.uid).valueChanges().subscribe(
      data => {
        this.me = data
    });
  }
  updateMe(){
    let d = this.getCurrentDateTime()
    let itemsRef = this.db.list('Users/'+this.uid+'/'+this.uid);
    var data = {
      user_type:this.user_type,
      last_active:d,
      is_online:'1'
    }
    itemsRef.update('updatable', data);
    // const itemRef = this.db.object('Users/'+this.uid);
    // itemRef.set(data);
    
  }


  //send message related
  sendMessage(mtype){
    this.mtype=mtype
    let d = this.getCurrentDateTime()
    var data;
    if(mtype==0){
      data = {
        'msg':this.myfileurl,
        'from':this.uid,
        'to':this.clicked_id,
        'type':'image',
        'created_on':d,
      }
    }
    else if(mtype==1){
      data = {
        'msg':this.myfileurl,
        'from':this.uid,
        'to':this.clicked_id,
        'type':'video',
        'created_on':d,
      }
    }
    else if(mtype==2){
      data = {
        'msg':this.myfileurl,
        'from':this.uid,
        'to':this.clicked_id,
        'type':'application',
        'created_on':d,
      }
    }
    else if(mtype==3){
      data = {
        'msg':this.myInput,
        'from':this.uid,
        'to':this.clicked_id,
        'type':'text',
        'created_on':d,
      }
    }

    let itemsRef = this.db.list('Msgs/'+this.mid);
    itemsRef.push(data);
    
    data={
      from:this.uid,
      to:this.clicked_id,
      count:1
    }
    itemsRef = this.db.list('LastMsgs/');
    itemsRef.update(this.mid,data);
    
    this.myInput=''
  }
  handleSubmit(event){
    // Remove newMsg count
    this.hideNewMsg()
    if(event.keyCode === 13){
      this.sendMessage(3);
    }
  }
  activeMsg(event){
    // Remove newMsg count
    this.hideNewMsg()
  }


  //search related
  handleSearch(event){
    this.search()
  }
  handleSearchSubmit(event){
    this.search()
  }
  search(){
    let text = this.mySearInput
    console.log(text)
    this.uid = this.LoginAuthService.getUserData().user_id;
    // bohot khatarnak logic he. mujhe vi nehi pata kese ban gaya. delete mat karna.
    this.items=[]
    this.name_filtered_items=[]
    this.db.list("Users").valueChanges().subscribe(
      data => {
        let count=0;
        for(let m in data){
          let d: any = data[m]
          for(let x in d){
            if(data[m][x]['id']!=this.uid){
              if(data[m][x]['nameToSearch'].includes(text)){
                this.items[count]=data[m][x]
                this.name_filtered_items[count]=data[m][x]
                count++;
              }
            }
          }
        }
      });
  }
  
}
