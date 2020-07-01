import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/authentication/login.service';
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;
declare var swal:any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  phoneNumber;
  countryCode;
  errormessage;
  forgotPasswordForm:FormGroup;
  submitted;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private LoginService: LoginService,
    private LoginAuthService : LoginAuthService,
    private formBuilder: FormBuilder 


  ) { }

  ngOnInit() {


    if (this.LoginAuthService.isLoggednIn()){
      this.router.navigate(['/'])
    } 
    this.forgotPasswordForm = this.formBuilder.group({
      phonenumber: ['', [Validators.required, Validators.minLength(6)]],
      countrycode: ['', Validators.required],
      });
      this.countryCode='+91'

  }


  get f() { return this.forgotPasswordForm.controls; }


  trysendotp(){
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      
      return;
    }
    this.LoginService.reset_pass_otp_generate({
      phonenumber:this.phoneNumber,
      countrycode:this.countryCode

    }).subscribe(response=>{
      console.log(response);    
      swal("Good Job!", "OTP sent successfully.", "success");

      // set on session storage

      this.LoginAuthService.set_phone_and_code(this.phoneNumber,this.countryCode)

      this.router.navigate(['/otp-verify'],{ queryParams: { next: '/change-password' } })

    },error=>{
      this.resetPassError(error.error.message); 
    });
  }
  resetPassError(e) {


    console.log(e);
    
    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }
  }

