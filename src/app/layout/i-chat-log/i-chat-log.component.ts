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
import { SHARED_FORM_DIRECTIVES } from '@angular/forms/src/directives';

declare var $:any;
declare var $: any;
declare var swal:any;

@Component({
  selector: 'app-i-chat-log',
  templateUrl: './i-chat-log.component.html',
  styleUrls: ['./i-chat-log.component.css']
})
export class IChatLogComponent implements OnInit {
  x=[];
  uid;
  msgs;
  mid;
  mids=[];
  yous=[];
  you;
  me;
  yids=[];
  isHiddenMsgDetail=true;
  clicked_id;
  constructor(
    public db: AngularFireDatabase,
    private LoginAuthService :LoginAuthService,
    public firebaseService: FirebaseService,
    private router: Router,
    private formBuilder: FormBuilder, 
    private LoginService: LoginService
  ) { }

  ngOnInit() {
    if(!this.LoginAuthService.getUserData()){
      swal('Please login to access chat',)
      this.router.navigate(['/login/']);
    }
    this.uid = this.LoginAuthService.getUserData().user_id;
    
    let i=0;
    let itemsRef = this.db.list('conversation/user_'+this.uid);
    itemsRef.snapshotChanges(['child_added'])
    .subscribe(actions => {
      actions.forEach(action => {
        this.mids[i]=action.key;
        let sp = action.key.split("_");
        if(sp[0]!=this.uid){
          this.yids[i]= +sp[0];
        }
        else{
          this.yids[i]= +sp[1];
        }
        i++;
      });
    });
    var v;
    var j=0;
    setTimeout(()=>{
      itemsRef = this.db.list('users/');
      itemsRef.snapshotChanges(['child_added'])
      .subscribe(actions => {
        actions.forEach(action => {
          for(var i=0; i<this.yids.length;i++){
            if(action.payload.val()['id']==this.yids[i]){
              this.yous[j]=action.payload.val();
              j++;
            }
          }
        });
      });
    },2000);

    console.log(this.mids);
    console.log(this.yids);
    console.log(this.yous);
  }


  //message list
  viewDetail(clicked_id){
    this.uid = +this.LoginAuthService.getUserData().user_id;
    this.clicked_id = +clicked_id;
    if(clicked_id<this.uid){
      this.mid=clicked_id+'_'+this.uid
    }
    else{
      this.mid=this.uid+'_'+clicked_id
    }
    // #show all data
    console.log(this.mid)
    this.db.list("messages/"+this.mid).valueChanges().subscribe(
      data => {
        this.msgs = data
        console.log(this.msgs)
    });
    this.getMe();
    this.getYou();
    // this.db.list("users/user_"+this.clicked_id).valueChanges().subscribe(
    //   data => {
    //     // this.you = data
    //     this.you = {
    //       'id':data[0],
    //       'isOnline':data[1],
    //       'name':data[2],
    //       'profilePic':data[3],
    //       'role':data[4],
    //     };
    // });
    this.isHiddenMsgDetail=false;
  }


  getMe(){
    this.db.list("users/user_"+this.uid).valueChanges().subscribe(
      data => {
        console.log('initializing this.me')
        this.me = data;
        // this.me = {
        //   'id':data[0],
        //   'isOnline':data[1],
        //   'name':data[2],
        //   'profilePic':data[3],
        //   'role':data[4],
        // };
        console.log(this.me.length)
    },error=>{
      console.log(error)
    });
    
  }
  getYou(){
    this.db.list("users/user_"+this.clicked_id).valueChanges().subscribe(
      data => {
        this.you = data;
        // this.you = {
        //   'id':data[0],
        //   'isOnline':data[1],
        //   'name':data[2],
        //   'profilePic':data[3],
        //   'role':data[4],
        // };
        console.log(data)
        console.log(this.you);
        // return data;
    },error=>{
      console.log(error)
    });
  }

}
