import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { LoginService } from '../../services/authentication/login.service';
import { LoginAuthService } from '../../services/authentication/loginauth.service'

import { MessagingService } from '../../services/messaging/messaging.service';

declare var $: any;
declare var swal:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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


  constructor(
    
    private route: ActivatedRoute,
    private router: Router,
    private LoginService: LoginService,
    private LoginAuthService :LoginAuthService,
    private formBuilder: FormBuilder ,
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
      password: ['', [Validators.required,]],
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

    if (response['isnumverify']=='false'){
      this.LoginAuthService.sendTokenForVarification(response['token']);
      this.LoginAuthService.setUserData(response);

      localStorage.setItem('cartCount',response['cart_count'])
      localStorage.setItem('wishlistCount',response['wishlist_count'])
      localStorage.setItem('profileimg',response['profileimg'])
      localStorage.setItem('firstname', response['firstname'])
      localStorage.setItem('lastname',response['lastname'])
      localStorage.setItem('user_id',response['user_id'])

      this.LoginAuthService.set_phone_and_code(response['phonenumber'],response['countrycode']);
      swal("Welcome!", "Please verify your Number.", "success");
      this.router.navigate(['/otp-verify'], { queryParams: { next: '/numverifyforlogin' } });

    }else {
      this.LoginAuthService.sendToken(response['token']);
      this.LoginAuthService.setUserData(response);
      
      localStorage.setItem('cartCount',response['cart_count'])
      localStorage.setItem('wishlistCount',response['wishlist_count'])
      localStorage.setItem('profileimg',response['profileimg'])
      localStorage.setItem('firstname', response['firstname'])
      localStorage.setItem('lastname',response['lastname'])
      localStorage.setItem('user_id',response['user_id'])

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

// change toggel

changetoggle(){

  $('#hometab').removeClass('active');
  $('#menutab').addClass('active');

  $("#hometab1").attr("aria-expanded", false);
  $("#menutab1").attr("aria-expanded", true);


  $('#home').removeClass('active in');
  $('#menu1').addClass('active in');




}



  // register 

  tryregister(){
      this.Rssubmitted = true;
      if (this.registerForm.invalid) {
        
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
          
      swal("Good Job!", "You have been successfully Registered. Please verify your Number", "success");
      
     this.LoginAuthService.sendTokenForVarification(response['token']);
     this.LoginAuthService.setUserData(response);
     localStorage.setItem('cartCount','0');
     localStorage.setItem('wishlistCount','0');
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

  }


