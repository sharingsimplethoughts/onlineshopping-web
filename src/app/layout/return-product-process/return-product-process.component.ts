import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment/payment.service';
import { ManufacturerService } from '../../services/manufacturer/manufacturer.service'
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service'
import {FormGroup , FormControl, AbstractControl, ValidationErrors} from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms';
import { switchAll } from 'rxjs/operators';

declare var $:any;
declare var swal:any;

@Component({
  selector: 'app-return-product-process',
  templateUrl: './return-product-process.component.html',
  styleUrls: ['./return-product-process.component.css']
})
export class ReturnProductProcessComponent implements OnInit {
  order_detail_id;
  cart_id;
  address;
  payment;
  special_price;
  actual_price;
  is_payment_required;
  is_refund_required;

  order_id;
  image_id;
  size_id;
  msg_id;
  msg;
  payment_detail;
  order_detail;
  product_detail;
  errormessage;
  constructor(
    protected fb : FormBuilder,
    private paymentservice: PaymentService,
    private ManufacturerService :ManufacturerService,
    private route: ActivatedRoute,
    private router:Router,
    private LoginAuthService:LoginAuthService,
    private StylistDesignerService :StylistDesignerService 
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.order_id = params['order_id'];
      this.image_id = params['image_id'];
      this.size_id = params['size_id'];
    
      // this.msg_id = params['msg_id'];
      
      if(localStorage.getItem('tempMsg')){
        this.msg = localStorage.getItem('tempMsg')
      }

      var data={
        order_detail_id:this.order_id,
        exchange_description:this.msg,
        selected_colour:this.image_id,
        selected_size:this.size_id,
      };
      this.StylistDesignerService.set_exchange_product(data).subscribe(
        response => {                  
          this.payment_detail=response['payment_detail'];
          this.order_detail=response['order_detail'];
          this.product_detail=response['product_detail'];
        },
        error => {
          this.loginError(error.error.message);  
        }
      );

      }
    );
  }
  loginError(e) {
    console.log(e);
    this.errormessage = e;
    setTimeout(() => {
      this.errormessage = "";
    }, 4000);
  }

  proceedCheck(){
    var total = this.payment_detail['grand_total']
    if(total<0){
      this.PlaceOrder_and_makePayment()
      swal("", "Product exchanged successfully. Your balance amount will be refunded within 7 working days.", "success");
    }
    else if(total==0){
      this.PlaceOrder_and_makePayment()
      swal("", "Product exchanged successfully.", "success");
    }
    else{
      localStorage.setItem("updatedPrice", this.payment_detail['grand_total'])
      localStorage.setItem("cart_id", this.order_detail['cart_id'])
      localStorage.setItem("address", this.order_detail['address'])
      localStorage.setItem("order_detail_id", this.order_detail['order_detail_id'])
      localStorage.setItem("special_price", this.product_detail['special_price'])
      localStorage.setItem("actual_price", this.product_detail['actual_price'])
      localStorage.setItem("is_payment_required", this.order_detail['is_payment_required'])
      localStorage.setItem("is_refund_required", this.order_detail['is_refund_required'])


      // this.router.navigate(['/payment-method'])
      this.router.navigate(['/exchange-payment-method'])
          // var data={
            
          // }
          // this.StylistDesignerService.set_exchange_msg(data).subscribe(
          //   response => {                  
          //     this.router.navigate(['/return-product-process/'+this.oid+'/'+this.colour_and_images.id+'/'+this.selected_size+'/'+response['id']]);
          //   },
          //   error => {
          //     this.loginError(error.error.message);  
          //   }
          // );

    }
  }


  PlaceOrder_and_makePayment() {
    if (this.LoginAuthService.isLoggednIn()) {
      if (this.payment==null){
        swal("", "Please select a payment method", "info")
        return false
      }
      if (this.payment==1 && localStorage.getItem("cardToken")==null){
        swal("", "Please select a card or add a new card", "info")
        return false
      }
      this.paymentservice.makePayment_ExchangeOrder({
        cart_id:this.order_detail['cart_id'],
        order_detail_id:this.order_detail['order_detail_id'],
        address:this.order_detail['address'],
        payment:1,
        grand_total: this.payment_detail['grand_total'],
        special_price:this.product_detail['special_price'],
        actual_price:this.product_detail['actual_price'],
        currency:'usd',
        source_token:localStorage.getItem("cardToken")==null?'':localStorage.getItem("cardToken"),
        is_card_save:false,

        is_payment_required:this.order_detail['is_payment_required'],
        is_refund_required:this.order_detail['is_refund_required'],
        bank_holder_name:"kkk",
        bank_name:"kk",
        account_number:"kk",
        ifsc_code:"kk",
        branch_addr:"kk"
      }).subscribe(x => { 
        console.log(x['message'])
        swal("success", x['message'], "success")
        localStorage.removeItem("cart_items")
        localStorage.removeItem("cardToken")
        // localStorage.removeItem("selectedAddId") 
         this.router.navigate(['/orders'])
      }, error => {
        swal("", error.error['message'],'error')
        console.log(error)
      })
    } else {
      swal("Logged in", "Please login and proceed", "info")
    }
  }
  

}
