import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment/payment.service';
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { CartitemsService } from '../../services/cartitems/cartitems.service';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var swal: any;
declare var $: any;
@Component({
  selector: 'app-return-product-payment-method',
  templateUrl: './return-product-payment-method.component.html',
  styleUrls: ['./return-product-payment-method.component.css']
})
export class ReturnProductPaymentMethodComponent implements OnInit {
  order_detail_id;
  cart_id;
  address;
  payment;
  special_price;
  actual_price;
  is_payment_required;
  is_refund_required;


  user;
    
  sourceToken;
  savedCards;
  updatedPrice;
  oldPrice;
  couponStatus: boolean;
  couponText;
  couponOff;
  showProceedButton;
  public show: boolean = true;
  
  currency='usd';
  constructor(
    private paymentservice: PaymentService,
    private cartitemservice: CartitemsService,
    private StylistDesignerService: StylistDesignerService,
    private LoginAuthService: LoginAuthService,
    private router:Router) { }

  ngOnInit() {
    this.getCartItems();
    $('#collapseOne').collapse('hide')


    document.body.scrollTop = document.documentElement.scrollTop = 0;
    //-------------------------------------------------------------------------
    
    //------------------------------------------------------------------------    
    if (localStorage.getItem("userData")) {
      this.user = JSON.parse(localStorage.getItem("userData"))
      // console.log(localStorage.getItem("userData"))
    }
    if (localStorage.getItem("address")) {
      this.address = localStorage.getItem("address")
      // console.log(localStorage.getItem("userAddress"))
    }
    if(localStorage.getItem("oldPrice")){
      this.oldPrice = localStorage.getItem("oldPrice")
    }
    if (localStorage.getItem("cart_id")) {
      this.cart_id = localStorage.getItem("cart_id")
      

      // console.log(localStorage.getItem("cart_items"))
      // console.log(this.cartItemsId[0].id)
    }
    if (localStorage.getItem("cardToken")) {
      console.log(this.sourceToken)
      this.sourceToken = localStorage.getItem("cardToken")
      // console.log(localStorage.getItem("cardToken"))
    }else{
      this.sourceToken = ''
    }
    
    if (localStorage.getItem("updatedPrice")) {
      this.updatedPrice = localStorage.getItem("updatedPrice")
    }else{
      this.updatedPrice = localStorage.getItem("oldPrice")
    }
    if (localStorage.getItem("coupon_applied")) {
      this.couponOff = localStorage.getItem("coupon_applied")
    }

//**** */
    console.log('*****************')
    if (localStorage.getItem("order_detail_id")) {
      this.order_detail_id = localStorage.getItem("order_detail_id")
      console.log(this.order_detail_id)
    }
    if (localStorage.getItem("special_price")) {
      this.special_price = localStorage.getItem("special_price")
      console.log(this.special_price)
    }
    if (localStorage.getItem("actual_price")) {
      this.actual_price = localStorage.getItem("actual_price")
      console.log(this.actual_price)
    }
    if (localStorage.getItem("is_payment_required")) {
      this.is_payment_required = localStorage.getItem("is_payment_required")
      console.log(this.is_payment_required)
    }
    if (localStorage.getItem("is_refund_required")) {
      this.is_refund_required = localStorage.getItem("is_refund_required")
      console.log(this.is_refund_required)
    }
//*** */


    $(document).ready(function () {
      $("#scrolldown").click(function () {
        $("html, body").animate({
          scrollTop: $(
            'html, body').get(0).scrollHeight - 250
        }, 500);
      });
    });

    this.isCouponApplied();
  
    // this.getAllSavedCardData();
    // this.toggle();
  }

  toggle() {
    // $('html, body').animate({
    //   scrollTop: $("#collapseTwo").scrollTop() 
    // }, 2000);
    this.payment = 1
    this.show = !this.show;
    this.currency = 'usd';

  }
  cashOnDel() {
    $('#collapseTwo').collapse('hide')
    // $('#collapseThree').collapse('hide')

    this.show = true;
    this.payment = 2
    this.currency = 'usd';
    this.sourceToken='';
  }
  netBanking(){
    // $('#collapseThree').collapse('hide')
    // $('#collapseTwo').collapse('hide')

    this.show = true;
    this.payment = 3
    this.sourceToken='';

  }

  isCouponApplied() {
    
    if (localStorage.getItem("appliedCoupon")) {
      
      this.couponText = localStorage.getItem("appliedCoupon")
      this.couponStatus = true;
    } else {
      this.couponText=''
      this.couponStatus = false;
    }
  }

  priceDetails;
  shippingPrice;
  saved_ammount;
  price;
  items;


  getCartItems() {
    this.StylistDesignerService.get_cart_item().subscribe(res => {
      
      if(res['cart_items'].length==0){
        this.router.navigate(['/cart']);
        return false
      }

      this.priceDetails = res['price_details']
      this.shippingPrice = this.priceDetails['shipping_charges']
      this.saved_ammount = this.priceDetails['saved_ammount']
      this.price = this.priceDetails['price']
      this.items = this.priceDetails['items']
    })
  }


  getAllSavedCardData() {
    this.paymentservice.getSavedCards().subscribe((x) => {
      // console.log(x);
      this.savedCards = Object.values(x)[0]
      // console.log(this.savedCards)
    }
    )
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
      var xw = {
        cart_id:this.cart_id,
        order_detail_id:this.order_detail_id,
        address:this.address,
        payment:this.payment,
        grand_total: this.updatedPrice,
        special_price:this.special_price,
        actual_price:this.actual_price,
        currency:this.currency,
        source_token:localStorage.getItem("cardToken")==null?'':localStorage.getItem("cardToken"),
        is_card_save:false,

        is_payment_required:this.is_payment_required,
        is_refund_required:this.is_refund_required,
        bank_holder_name:"kkk",
        bank_name:"kk",
        account_number:"kk",
        ifsc_code:"kk",
        branch_addr:"kk"
      }
      console.log(xw)

      this.paymentservice.makePayment_ExchangeOrder({
        cart_id:this.cart_id,
        order_detail_id:this.order_detail_id,
        address:this.address,
        payment:this.payment,
        grand_total: this.updatedPrice,
        special_price:this.special_price,
        actual_price:this.actual_price,
        currency:this.currency,
        source_token:localStorage.getItem("cardToken")==null?'':localStorage.getItem("cardToken"),
        is_card_save:false,

        is_payment_required:this.is_payment_required,
        is_refund_required:this.is_refund_required,
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
