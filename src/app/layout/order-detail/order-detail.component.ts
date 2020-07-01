import { Component, OnInit } from '@angular/core';
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import {FormGroup , FormControl, AbstractControl, ValidationErrors} from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms';

declare var swal: any;
declare var $: any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order_status ={
    '1':'Ordered',
    '2': 'Packed',
    '3':'Shipped',
    '4':'Delivered',
    '5':'Cancelled',
    '6':'Out for delivery',
    '7':'Returned',
    '8':'Return accepted',
    '9':'Return completed and refuned',
    '10':'Exchanged',
    '11':'Pickuped and exchanged',
    '12':'Delivered and exchanged'
  }
  return_form : FormGroup;
  order;
  full_order_detail;
  baseUrl=environment.baseUrl;
  current_status;
  order_id;
  latest_status;
  errormessage;
  constructor(
    protected fb : FormBuilder,
    private StylistDesignerService: StylistDesignerService,
    private LoginAuthService: LoginAuthService,
    private route: ActivatedRoute,
    private router:Router,) { 

    }

  ngOnInit() {
    if(!this.LoginAuthService.isLoggednIn){
      this.router.navigate(['/']);
      return false
    }
    this.route.params.subscribe(params => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.order_id = params['id'];

    });
    this.get_orders_detail(this.order_id);

    //************Form Creation*************/
    this.return_form = this.fb.group({
      ifsc_code:'',
      account_number:'',
      branch_addr:'',
      bank_holder_name:'',
      bank_name:'',
    });
    this.errormessage='';
  }

  mainForm(val,type){
    // debugger
    var val = val
    if(val==4){
      $('#other_text').prop('readonly',false);
    }
    if(val!=4){
      $('#other_text').val('');
      $('#other_text').prop('readonly',true);
    }
    $('#return_description').val(val);
  }
  productRating(val,type){
    // debugger
    var val = val
    var data = {
      order_detail_id:this.full_order_detail.id,
      rating:val
    }
    console.log(data)
    this.StylistDesignerService.set_rating(data).subscribe(
        response => {                  
          console.log(response)
          swal("","Thank you for your rating.",'success');   
        },
        error => {
          this.loginError(error.error.message);  
        }
      );
    // if(val==4){
    //   $('#other_text').prop('readonly',false);
    // }
    // if(val!=4){
    //   $('#other_text').val('');
    //   $('#other_text').prop('readonly',true);
    // }
    // $('#return_description').val(val);
  }

  //***********Form On Load Code**************/
  load_return_form(){
    this.return_form.setValue({
      ifsc_code: '',
      account_number: '',
      branch_addr: '',
      bank_holder_name: '',
      bank_name: '',
    });
  }



  //***********Form Validation Code*************/
  validate_return_form(){
    var bank_holder_name = this.return_form.value.bank_holder_name;  
    var bank_name = this.return_form.value.bank_name;
    var branch_addr = this.return_form.value.branch_addr;
    var account_number = this.return_form.value.account_number;  
    var ifsc_code = this.return_form.value.ifsc_code;
    
    if(!bank_holder_name || bank_holder_name==""){
      this.loginError("Bank holder name can not be empty")
      return false
    }    
    else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(bank_holder_name)){   
      this.loginError("Bank holder name can not contain special characters")
      return false;
    }
    else if(/\d/.test(bank_holder_name)){
      this.loginError("Bank holder name can not have numbers");
      return false;
    }
    if(!bank_name || bank_name==""){
      this.loginError("Bank name can not be empty")
      return false
    }
    if(!branch_addr || branch_addr==""){
      this.loginError("Branch address can not be empty")
      return false
    }
    if(!account_number || account_number==""){
      this.loginError("Account number can not be empty")
      return false
    }
    else if(/\s/g.test(account_number)){
      this.loginError("Account number can not contain space");
      return false;
    }  
    else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(account_number)){   
      this.loginError("Account number can not contain special characters")
      return false;
    }
    if(!ifsc_code || ifsc_code==""){
      this.loginError("IFSC code can not be empty")
      return false
    }
    else if(/\s/g.test(ifsc_code)){
      this.loginError("IFSC code can not contain space");
      return false;
    }  
    else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(ifsc_code)){   
      this.loginError("IFSC code can not contain special characters")
      return false;
    }
    // if(!email || email==""){
    //   this.loginError("email can not be blank");
    //   return false;
    // }  
    // else if (/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/.test(email)==false){
    //   this.loginError("email id is not valid");
    //   return false;
    // }
    // if(!password || password==""){
    //   this.loginError("Please provide password");
    //   return false;
    // }
    // else if(password.length<8){
    //   this.loginError("Password must have atleast 8 characters");
    //   return false;
    // }
    // if(!confirm_password || confirm_password==""){
    //   this.loginError("Please provide confirm password");
    //   return false;
    // }
    // else if(confirm_password.length<8){
    //   this.loginError("Confirm password must have atleast 8 characters");
    //   return false;
    // }
    // if(confirm_password!=password){
    //   this.loginError("Password and Confirm password not matching");
    //   return false;
    // }
    // if(!name || name==""){
    //   this.loginError("Name can not be blank");
    //   return false;
    // }
    // else if(/\d/.test(name)){
    //   this.loginError("Name can not have numbers");
    //   return false;
    // }
    // else if(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(name)){
    //   this.loginError("Name can not have special characters");
    //   return false;
    // }
    // if(!profession || profession==""){
    //   this.loginError("Please provide profession");
    //   return false;
    // }
    // if(!picture || picture==null){
    //   this.loginError("Please provide picture");
    //   return false;
    // }
    return true
  }

  //**************API Call*******************

  set_return_form(){
    if(this.validate_return_form()){
      // let inputValue = (document.getElementById(elementId) as HTMLInputElement).value;
      var id = (document.getElementById('order_detail_id') as HTMLInputElement).value
      var return_description = (document.getElementById('return_description') as HTMLInputElement).value
      if(return_description == '4'){
        return_description = (document.getElementById('other_text') as HTMLInputElement).value
      }
      document.getElementById('radio1')
      var data={
        order_detail_id:id,
        return_description:return_description,
        ifsc_code:this.return_form.value.ifsc_code,
        account_number:this.return_form.value.account_number,
        branch_addr:this.return_form.value.branch_addr,
        bank_holder_name:this.return_form.value.bank_holder_name,
        bank_name:this.return_form.value.bank_name,
      };
      console.log('hi----')
      console.log(data)
      this.StylistDesignerService.set_return_product(data).subscribe(
        response => {                  
          console.log(response)
          // this.load_return_form()
        },
        error => {
          this.loginError(error.error.message);  
          // console.log('error',error)        
          // swal("",error.error['message'],'error');         
        }
      );
    }
  }

  get_orders_detail(order_id){
    this.StylistDesignerService.get_order_detail(order_id).subscribe(response=>{

      this.order = response['order_detail']['product_detail']
      this.full_order_detail = response['order_detail']
      this.latest_status = response['latest_status']
      
    },error=>{
      // swal("", error.error['message'],'error');
      this.loginError(error.error.message);  
    })
  }

  loginError(e) {
    console.log(e);
    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }
}
