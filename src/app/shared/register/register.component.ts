import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoginService } from '../../services/authentication/login.service';
import { LoginAuthService } from '../../services/authentication/loginauth.service';
import { FirebaseService } from '../../services/firebase/firebase.service';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { MessagingService } from '../../services/messaging/messaging.service';


declare var $: any;
declare var swal:any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loginForm: FormGroup;
  registerForm : FormGroup;
  submitted = false;
  Rssubmitted = false;

  phoneNumber;
  password;
  countryCode;
  errormessage;
  countryCodeError;
  phoneNumberError;
  passwordError;

  Rserrormessage;
  email;
  Rspassword;
  RscountryCode;
  firstname;
  lastname;
  RsphoneNumber;
  itemsRef
  items

  firebase = environment.firebase
  constructor(
    public db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private LoginService: LoginService,
    private FirebaseService: FirebaseService,
    private LoginAuthService :LoginAuthService,
    private formBuilder: FormBuilder,
    private messagingService: MessagingService
  ) { }
  ngOnInit() {

    $('h6 a[data-target="#menu1"]').on('click', function(){
      $('.nav-tabs li').removeClass('active');
      $('.nav-tabs li a[data-target="#menu1"]').parent('li').addClass('active');
    });

    if (this.LoginAuthService.isLoggednIn()){
      this.router.navigate(['/'])
    }
    this.loginForm = this.formBuilder.group({
      phonenumber: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required]],
      countrycode: ['', Validators.required],
      });
    this.countryCode='+91'
    this.RscountryCode = '+91'

    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      Rsphonenumber: ['', [Validators.required, Validators.minLength(6)]],
      Rspassword: ['', [Validators.required,Validators.minLength(8)]],
      RscountryCode: ['', Validators.required],
      });

  }
  get rf() { return this.registerForm.controls; }
  get f() { return this.loginForm.controls; }

  extra_validation_registerForm(){
    var firstname = this.registerForm.value.firstname;
    var lastname = this.registerForm.value.lastname;
    var email = this.registerForm.value.email;
    var Rsphonenumber = this.registerForm.value.Rsphonenumber;
    var Rspassword = this.registerForm.value.Rspassword;  
    var RscountryCode = this.registerForm.value.RscountryCode; 
    
    if(/\d/.test(firstname)){
      this.registerError("First name can not contain numbers");
      return false;
    }
    else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(firstname)){
      // var regx = new RegExp(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g);
      // console.log(regx.test(name))
      this.registerError("First name can not contain special characters")
      return false;
    } 
    else if(firstname.length<2 || firstname.length>32){
      this.registerError("First name must contain in between 2 to 32 characters");
      return false;
    }

    if(/\d/.test(lastname)){
      this.registerError("Last name can not contain numbers");
      return false;
    } 
    else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(lastname)){
      // var regx = new RegExp(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g);
      // console.log(regx.test(name))
      this.registerError("Last name can not contain special characters")
      return false;
    }
    else if(lastname.length<2 || lastname.length>32){
      this.registerError("Last name must contain in between 2 to 32 characters");
      return false;
    }

    if(Rspassword.length<8){
      this.registerError("Password must have atleast 8 characters");
      return false;
    }
    else if(Rspassword.length>32){
      this.registerError("Password can have maximum 32 characters");
      return false;
    }

    if(Rsphonenumber.length<6 || Rsphonenumber.length>15){
      this.registerError("Mobile must contain in between 6 to 15 digits");
      return false;
    }

    return true;
  }

  async trylogin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      
      return;
    }
    var device_token = localStorage.getItem('device_token')  //-----required for push notification
    this.LoginService.login({
      phonenumber:this.phoneNumber,
      password:this.password,
      device_type:'web',
      device_token:device_token,
      countrycode:this.countryCode
    }).subscribe(response=>{
      console.log(response);
      
      swal("Welcome!", "You are Logged in now.", "success");
      
     this.LoginAuthService.sendToken(response['token']);

    if (response['isnumverify']=='false'){
      this.LoginAuthService.sendTokenForVarification(response['token']);
      this.LoginAuthService.setUserData(response);
      this.LoginAuthService.set_phone_and_code(response['phonenumber'],response['countrycode']);
      swal("Welcome!", "Please verify your Number.", "success");
      this.router.navigate(['/otp-verify'], { queryParams: { next: '/numverifyforlogin' } });

    }else {
      this.LoginAuthService.sendToken(response['token']);
      this.LoginAuthService.setUserData(response);
      this.router.navigate(['/']);
    }  

    },error=>{
      if ( error.error.password) {
        this.loginError('Please correct your password');
      }else{
      this.loginError(error.error.message); 
      }
    });
  }
  loginError(e) {
    console.log(e);
    
    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }


  // register 

  tryregister(){
    
      this.Rssubmitted = true;
      if (this.registerForm.invalid) {
        
        return;
      }
      if(!this.extra_validation_registerForm()){
        return;
      }

    var device_token = localStorage.getItem('device_token')  //-----required for push notification
    this.LoginService.register_and_otp_create({
      phonenumber:this.RsphoneNumber,
      password:this.Rspassword,
      device_type:'web',
      device_token:device_token,
      countrycode:this.RscountryCode,
      email:this.email,
      firstname:this.firstname,
      lastname:this.lastname

    }).subscribe(response=>{
      console.log(response);
      console.log('10')
      swal("Good Job!", "You have been successfully Registered. Please verify your Number", "success");
     this.LoginAuthService.sendTokenForVarification(response['token']);

     //-------------CREATE FIREBASE USER SUK----------------------
    //  if(response && response['token']){
    //   let name = this.firstname+' '+this.lastname
    //   let d = this.getCurrentDateTime()
    //   var data = {
    //     id:response['user_id'],
    //     name: name,
    //     nameToSearch: name.toLowerCase(),
    //     profile_picture:'',
    //     created_on:d,
    //   }
    //   let itemRef = this.db.object('Users/'+data['id']+'/'+data['id']);
    //   itemRef.set(data);
    //   itemRef = this.db.object('Users/'+data['id']+'/'+data['id']+'/updatable');
    //   var updatable = {
    //     user_type:'',
    //     last_active:'',
    //     is_online:'0',
    //   }
    //   itemRef.set(updatable);
    //  }
     //-----------------------------------------------------------

     this.LoginAuthService.setUserData(response);
     this.LoginAuthService.set_phone_and_code(this.RsphoneNumber,this.RscountryCode);
     this.router.navigate(['/otp-verify'],{ queryParams: { next: '/' } })

    },error=>{
      if ( error.error.firstname) {
        this.registerError('Please correct your firstname');
      }
      else if ( error.error.lastname) {
        this.registerError('Please correct your lastname');
      }
      else if (error.error.email){
        this.registerError(error.error.email[0])

      }
      else if ( error.error.password) {
        this.registerError('Please correct your password');
      }
      else{
      this.registerError(error.error.message);
      } 
    });

   }
   registerError(e) {
      console.log(e);
      
      this.Rserrormessage = e;
      setTimeout(() => {
        this.Rserrormessage = "";
      }, 4000);
    }



    getCurrentDateTime(){
      let d = new Date()
      let date = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear();
      let time = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
      let datetime = date+'('+time+')';
      return datetime;
    }
}
