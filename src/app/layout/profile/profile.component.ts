import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import { LoginService } from '../../services/authentication/login.service';
import { environment } from '../../../environments/environment';
import { LoginAuthService } from '../../services/authentication/loginauth.service';
declare var $: any;
declare var swal:any;


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileimg;
  profileimg2;
  picture;
  uid;
  me;
  uname;

  firstname;
  lastname;
  email;
  phonenumber;
  countrycode;
  gender;
  
  profileForm: FormGroup;
  submitted =false;
  errormessage;


  constructor(
    public db: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private LoginService: LoginService,
    private LoginAuthService :LoginAuthService,
    private formBuilder: FormBuilder 


  ) { }

  ngOnInit() {

    this.LoginService.getProfile().toPromise()
    .then(response => {
      console.log(response)
      this.firstname = response['user_other_data']['first_name']
      this.lastname = response['user_other_data']['last_name']
      this.email = response['user_other_data']['email']
      this.phonenumber = response['phonenum']
      this.countrycode = response['country_code']
      this.gender = response['gender']
      // this.profileimg = environment.baseUrl+response['profileimg']
      this.profileimg = response['profileimg']
      this.profileimg2 = response['profileimg']
    })
    .catch(console.log);
    
    this.profileForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phonenumber: ['', [Validators.required, Validators.minLength(6)]],
      countrycode: ['', Validators.required],
      gender:[''],
      picture:['']
    });

    $('#radioBtn a').on('click', function(){
      // alert('hello');
      $('#radioBtn a').removeClass('active').addClass('notActive');
      $(this).removeClass('notActive').addClass('active');
    });

    this.uid = this.LoginAuthService.getUserData().user_id;
    this.uid = +this.uid

  }

  validate_profileForm(){
    var firstname = this.profileForm.value.firstname;
    var lastname = this.profileForm.value.lastname;
    var phonenumber = this.profileForm.value.phonenumber;
    var countrycode = this.profileForm.value.countrycode; 

    if(/\d/.test(firstname)){
      this.loginError("First name can not contain numbers");
      return false;
    }
    else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(firstname)){
      // var regx = new RegExp(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g);
      // console.log(regx.test(name))
      this.loginError("First name can not contain special characters")
      return false;
    } 
    else if(firstname.length<2 || firstname.length>32){
      this.loginError("First name must contain in between 2 to 32 characters");
      return false;
    }

    if(/\d/.test(lastname)){
      this.loginError("Last name can not contain numbers");
      return false;
    } 
    else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(lastname)){
      // var regx = new RegExp(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g);
      // console.log(regx.test(name))
      this.loginError("Last name can not contain special characters")
      return false;
    }
    else if(lastname.length<2 || lastname.length>32){
      this.loginError("Last name must contain in between 2 to 32 characters");
      return false;
    }

    if(phonenumber.length<6 || phonenumber.length>15){
      this.loginError("Mobile must contain in between 6 to 15 digits");
      return false;
    }

    return true
  }
  
  single = new Array();
  singleFiles(event) {
    const file1 = event.target.files[0]
    if(file1){
      if(file1.type!="image/jpeg" && file1.type!="image/jpg" && file1.type!="image/png"){
        this.loginError("Please upload files of type jpg/jpeg/png");
        return false;
      }
      if(file1.size>1000000000){
        this.loginError("Please upload files of maximum 10mb in size");
        return false;
      }
    }

    this.single = [];
    var singleFiles = event.target.files;
    if (singleFiles) {
      for (var file of singleFiles) {
        var singleReader = new FileReader();
        singleReader.onload = (e:any) => {
          this.single.push(e.target.result);
          $(event.target).closest('.input-group').find('#imagefile').attr('src', e.target.result).show();
        }
        singleReader.readAsDataURL(file);
      }
    }
    
    this.picture = event.target.files[0]
  }

  get f() { return this.profileForm.controls; }

  changegender(event){
    console.log(event.target.id)
    this.gender = event.target.id

  }

  async changeProfile() {
    this.submitted = true;

    if (this.profileForm.invalid) {
      
      return;
    }
    if(!this.validate_profileForm()){
      return 
    }

    let dataToSend = new FormData();
    dataToSend.append('phonenumber',this.phonenumber)
    dataToSend.append('countrycode',this.countrycode)
    dataToSend.append('firstname',this.firstname)
    dataToSend.append('lastname',this.lastname)
    dataToSend.append('email',this.email)
    dataToSend.append('gender',this.gender)
    dataToSend.append('profileimg',this.picture)
    console.log(this.profileForm.value.picture)
    this.LoginService.updateProfile(dataToSend).subscribe(response=>{
      console.log(response);
      



      
      swal("", "Your Profile Changed Successfully", "success");
      this.LoginService.getProfile().toPromise()
      .then(response => {
        console.log(response)
        this.firstname = response['user_other_data']['first_name']
        this.lastname = response['user_other_data']['last_name']
        this.email = response['user_other_data']['email']
        this.phonenumber = response['phonenum']
        this.countrycode = response['country_code']
        this.gender = response['gender']
        // this.profileimg = environment.baseUrl+response['profileimg']
        this.profileimg = response['profileimg']
        this.profileimg2 = response['profileimg']
        this.uname = this.firstname+' '+this.lastname

        this.getMe();
      })
      .catch(console.log);

    },error=>{
      this.loginError(error.error.message); 
    });

  }

  getMe(){
    this.db.list("users/user_"+this.uid).valueChanges().subscribe(
      data => {
        this.me = data;
    },error=>{
      console.log(error)
    });
    if(this.me){
      this.updateMe()
    }
    else{
      this.createMe();
    }
  }
  createMe(){
    var data = {
      id:this.uid,
      isOnline:false,
      name: this.uname,
      profilePic:this.profileimg2,
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
    let d = this.getCurrentDateTime();
    let itemsRef = this.db.list('users/');
    var data1 = {
      id:this.uid,
      isOnline:false,
      name:this.uname,
      profilePic:this.profileimg2,
      role:this.me[4]
    }
    itemsRef.update('user_'+this.uid, data1);
  }
  getCurrentDateTime(){
    return new Date().getTime();
  }

  loginError(e) {
    console.log(e);
    
    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }

}
