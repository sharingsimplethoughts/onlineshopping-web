import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/authentication/login.service';
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


declare var $: any;
declare var swal:any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

oldpassword;
newpassword;
confpassword;  
errormessage;


changePasswordForm:FormGroup;
submitted=false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private LoginService: LoginService,
    private LoginAuthService :LoginAuthService,
    private formBuilder: FormBuilder 


  ) { }

  ngOnInit() {

    if (this.LoginAuthService.isLoggednIn()){
      // do somthing i dont know

    }

    else{
      this.router.navigate(['/login'])
    }




    this.changePasswordForm = this.formBuilder.group({
      oldpassword: ['', [Validators.required, Validators.minLength(8)]],
      confpassword: ['', [Validators.required, Validators.minLength(8)]],
      newpassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      // {validator: this.checkIfMatchingPasswords('password', 'confpassword')},
      );


  
  }

  // checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    
  //   return (group: FormGroup) => {
  //     let passwordInput = group.controls[passwordKey],
  //         passwordConfirmationInput = group.controls[passwordConfirmationKey];
  //     if (passwordInput.value !== passwordConfirmationInput.value) {
  //       return passwordConfirmationInput.setErrors({notEquivalent: true})
  //     }
  //     else {
  //         return passwordConfirmationInput.setErrors(null);
  //     }
  //   }
  // }

  get f(){ return this.changePasswordForm.controls; }

  trychangePassword(){

    this.submitted = true;
    

    if (this.changePasswordForm.invalid) {
      
      return;
    }



    this.LoginService.changepassword({
      oldPassword:this.oldpassword,
      newPassword:this.newpassword,
      confPassword:this.confpassword


    }).subscribe(response=>{
      console.log(response);

      swal("Good Job!", "Password changed successfully.", "success");
      
     this.router.navigate(['/'])

    },error=>{
      this.changePassError(error.error.message); 
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



