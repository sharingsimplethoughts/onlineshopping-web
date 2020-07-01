import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/authentication/login.service';
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;
declare var swal:any;


@Component({
  selector: 'app-forgotpassform',
  templateUrl: './forgotpassform.component.html',
  styleUrls: ['./forgotpassform.component.css']
})
export class ForgotpassformComponent implements OnInit {

  forgetPassForm: FormGroup;
  newpassword;
  confpassword;  
  errormessage;

  
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private LoginService: LoginService,
      private LoginAuthService :LoginAuthService,
      private formBuilder: FormBuilder
    ) { }

  ngOnInit() {

    if (this.LoginAuthService.getTokenForVarification()){
      // do somthing i dont know

    }
    else{
      this.router.navigate(['/reset-password'])
    }

    this.forgetPassForm = this.formBuilder.group({
      newpassword: ['', [Validators.required, Validators.minLength(6)]],
      confpassword: ['', Validators.required]
  })
}

  trychangePassword(){
    this.LoginService.reset_pass({
      password:this.newpassword,
      confpassword:this.confpassword
    }).subscribe(response=>{
      console.log(response);

      swal("Good Job!", "Password Reset successfully.", "success");

      this.LoginAuthService.removeTokenForVarification()
      
     this.router.navigate(['/login'])

    },error=>{
        console.log(error.error)
      if ( error.error.password) {
        this.changePassError('New Password is required');
      }
      else if ( error.error.confpassword) {
        this.changePassError('Confirm password is required');
      }
      else{
        this.changePassError(error.error.message); 

      }

    });
  }
  changePassError(e) {
    console.log(e);
    
    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }
  }



