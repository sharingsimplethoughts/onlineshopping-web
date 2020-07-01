import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/authentication/login.service';
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { HttpHeaders } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;
declare var swal:any;

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.css']
})
export class OtpVerifyComponent implements OnInit {

submitted=false;
OtpVerifyForm : FormGroup;
otp;
url;
otperrormessage;
resend_active=true;
counteractive=false;
counter;

  constructor(
    private Activeroute: ActivatedRoute,
    private router: Router,
    private LoginService: LoginService,
    private LoginAuthService :LoginAuthService,
    private formBuilder: FormBuilder 


  ) { }

  ngOnInit() {

    // $('.swal-otp').click(function(){
    //   swal("Good Job!", "OTP verify.", "success");
    // });

    this.Activeroute.queryParamMap.subscribe(queryParamMap => {
      this.url = queryParamMap.get("next")
    })

    if(this.LoginAuthService.isPhoneAndCode()){

      //do somthing
      
    }else{

      if(this.url=='/'){
        this.router.navigate(['/login'])

      }
      else if (this.url=="/change-password"){
        this.router.navigate(['/forgot-password'])

      }else if (this.url=="/numverifyforlogin"){
        this.router.navigate(['/login'])
      }
      else{
        this.router.navigate(['/'])
      }

    }

    this.OtpVerifyForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(4)]],

      });

  }

  get f() { return this.OtpVerifyForm.controls; }

  checkotp(){

    this.submitted = true;

    if (this.OtpVerifyForm.invalid){
      
      return;
    }
debugger
    if (this.url=='/numverifyforlogin'){

      this.LoginService.otp_varify({
        verification_code : this.otp,
        phonenumber: this.LoginAuthService.get_from_sessionstorage('phonenumber'),
        countrycode:this.LoginAuthService.get_from_sessionstorage('countycode')
      }).subscribe(response=>{
        console.log(response);
        this.LoginAuthService.sendToken(this.LoginAuthService.getTokenForVarification())
        this.LoginAuthService.removeTokenForVarification()
        this.LoginAuthService.remove_phone_and_code()
        
        swal("Good Job!", "OTP verified.", "success");
        
  
        
        this.router.navigate(['/'])
        
      },error=>{
      
        this.RsotpError(error.error.message);
  
      });
      

    }

    if (this.url=='/'){

      this.LoginService.otp_varify({
        verification_code : this.otp,
        phonenumber: this.LoginAuthService.get_from_sessionstorage('phonenumber'),
        countrycode:this.LoginAuthService.get_from_sessionstorage('countycode')
      }).subscribe(response=>{
        console.log(response);
        this.LoginAuthService.sendToken(this.LoginAuthService.getTokenForVarification())
        this.LoginAuthService.removeTokenForVarification()
        this.LoginAuthService.remove_phone_and_code()
        
        swal("Good Job!", "OTP verified.", "success");
        
  
        
        this.router.navigate([this.url])
        
      },error=>{
      
        this.RsotpError(error.error.message);
  
      });
      

    }
    
    if (this.url=='/change-password'){
    this.LoginService.reset_pass_otp_verify({

      verification_code : this.otp,
      phonenumber: this.LoginAuthService.get_from_sessionstorage('phonenumber'),
      countrycode:this.LoginAuthService.get_from_sessionstorage('countycode')

    }).subscribe(response=>{
      
      console.log(response);
      this.LoginAuthService.remove_phone_and_code()
      this.LoginAuthService.sendTokenForVarification(response['token'])
       
      this.router.navigate([this.url])
      
    },error=>{
      
      this.otpError(error.error.message);

    });
  }}
  otpError(e) {
    console.log(e);
    this.otperrormessage = e;

    setTimeout(() => {
      this.otperrormessage = "";
    }, 4000);
  }
  RsotpError(e) {
    console.log(e);
    this.otperrormessage = e;

    setTimeout(() => {
      this.otperrormessage = "";
    }, 4000);
  }


  resendotp(){

    this.LoginService.otp_regenerate({

      phonenumber: this.LoginAuthService.get_from_sessionstorage('phonenumber'),
      countrycode:this.LoginAuthService.get_from_sessionstorage('countycode')

    }).subscribe(response=>{
      console.log(response);

      // for counter 

      var counter = 60
      
      var interval = setInterval(() => {
        this.counter = counter
        this.counteractive =true
        this.resend_active = false
        console.log(counter);
        counter--;

        if(counter == 0 ){

          this.resend_active = true
          this.counteractive =false


          clearInterval(interval);
          console.log('Ding!');
          
        };
      }, 1000);


      swal("Success!", "Otp send successfully.", "success");
      
    },error=>{
      
      this.resendotpError(error.error.message);

    });
  }
  resendotpError(e) {
    console.log(e);
    this.otperrormessage = e;

    setTimeout(() => {
      this.otperrormessage = "";
    }, 4000);
  }

}

  

