import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment/payment.service';
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { CartitemsService } from '../../services/cartitems/cartitems.service';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var swal: any;
declare var $: any;
@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  user;
  selectedAddId;
  cartItemsIds: any = [];
  sourceToken;
  savedCards;
  updatedPrice;
  oldPrice;
  couponStatus: boolean;
  couponText;
  couponOff;
  showProceedButton;
  public show: boolean = true;
  paymentType;
  currency='usd';


  constructor(
    private paymentservice: PaymentService,
    private cartitemservice: CartitemsService,
    private StylistDesignerService: StylistDesignerService,
    private LoginAuthService: LoginAuthService,
    private router:Router
    ) { }

  ngOnInit() {

    this.getCartItems();
    $('#collapseOne').collapse('hide')


    document.body.scrollTop = document.documentElement.scrollTop = 0;

    if (localStorage.getItem("userData")) {
      this.user = JSON.parse(localStorage.getItem("userData"))
      // console.log(localStorage.getItem("userData"))
    }
    if (localStorage.getItem("selectedAddId")) {
      this.selectedAddId = localStorage.getItem("selectedAddId")
      // console.log(localStorage.getItem("userAddress"))
    }
    if(localStorage.getItem("oldPrice")){
      this.oldPrice = localStorage.getItem("oldPrice")
    }
    if (localStorage.getItem("cart_items")) {
      var items = JSON.parse(localStorage.getItem("cart_items"))
      for (var i in items) {
        this.cartItemsIds.push(items[i].id) 
        console.log(this.cartItemsIds)
      }

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
    debugger
    if (localStorage.getItem("updatedPrice")) {
      this.updatedPrice = localStorage.getItem("updatedPrice")
      console.log(this.updatedPrice)
    }else{
      this.updatedPrice = localStorage.getItem("oldPrice")
    }
    if (localStorage.getItem("coupon_applied")) {
      this.couponOff = localStorage.getItem("coupon_applied")
    }

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
    this.paymentType = 1
    this.show = !this.show;
    this.currency = 'usd';

  }
  cashOnDel() {
    $('#collapseTwo').collapse('hide')
    // $('#collapseThree').collapse('hide')

    this.show = true;
    this.paymentType = 2
    this.currency = '';
    this.sourceToken='';
  }
  netBanking(){
    // $('#collapseThree').collapse('hide')
    // $('#collapseTwo').collapse('hide')

    this.show = true;
    this.paymentType = 3
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


      if (this.paymentType==null){
        swal("", "Please select a payment method", "info")
        return false
      }

      if (this.paymentType==1 && localStorage.getItem("cardToken")==null){
        swal("", "Please select a card or add a new card", "info")
        return false
      }
      
      this.paymentservice.makePayment_PlaceOrder({
        cart: this.cartItemsIds,
        address: this.selectedAddId,
        payment: this.paymentType,
        is_coupon_applied: this.couponStatus,
        coupon_code: this.couponText,
        shipping_charges: this.shippingPrice,
        saved_amount: this.saved_ammount,
        price: this.price,
        item: this.items,
        coupon_off: this.couponOff,
        grand_total: this.updatedPrice,
        currency: this.currency,
        source_token: localStorage.getItem("cardToken")==null?'':localStorage.getItem("cardToken"),
        is_card_save: false
      }).subscribe(x => { 
        console.log(x['message'])
        swal("success", x['message'], "success")
        localStorage.removeItem("cart_items")
        localStorage.removeItem("cardToken")
        localStorage.removeItem("selectedAddId")

        let cartCount= +localStorage.getItem('cartCount')
        cartCount = cartCount - 1
        localStorage.setItem('cartCount',cartCount.toString());
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
