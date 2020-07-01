import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StylistDesignerService } from '../../services/stylist-designer/stylist-designer.service'
import { LoginAuthService } from '../../services/authentication/loginauth.service'
import { CartitemsService } from '../../services/cartitems/cartitems.service'

declare var $:any;
declare var swal:any;


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  price_details;
  cart_items;
  coupons;
  selected_qty;
  message:string;
  coupon:string;
  applydCoupon;
  isCoupon:boolean;




  constructor(

    private StylistDesignerService :StylistDesignerService,
    private route: ActivatedRoute,
    private router:Router,
    private LoginAuthService:LoginAuthService,
    private CartitemsService :CartitemsService

  ) { }

  ngOnInit() {
    this.CartitemsService.currentMessage.subscribe(message => this.message = message)
    //scroll top
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    //check login
    if (this.LoginAuthService.isLoggednIn()){
      this.StylistDesignerService.get_cart_item().subscribe(response =>{

        this.cart_items = response['cart_items']
        this.coupons = response['coupons']
        this.price_details = response['price_details'] 
        localStorage.setItem("oldPrice", this.price_details['grand_total'])
      }),error=>{
        swal("Sorry!", "Something went wrong.", "error");
      }
    }else{
      this.cart_items = []
      this.coupons = []
      this.price_details = []
    }
    
    this.removeCouponValuesFromLocalStorage();
  }

  removeCouponValuesFromLocalStorage(){
    localStorage.removeItem("appliedCoupon")
    localStorage.removeItem("updatedPrice")
    localStorage.removeItem("coupon_applied")
    this.isCoupon = false;
  }
  ifCoupon(){
    if(localStorage.getItem("appliedCoupon")){
      this.applydCoupon =localStorage.getItem("appliedCoupon")
      this.isCoupon = true;

    }else{
      this.isCoupon = false;
    }
  }
  
  newMessage() {
    this.CartitemsService.changeMessage('ok')
  }
  saveCoupon(event){
    if(event.target.checked){
      this.coupon = event.target.id
      $('#prod-coupon').val(event.target.value)
      console.log(event.target.value)
      $('#coupon-modal').modal('hide');
    }else{
      swal("Please select atleast on coupon")
    }
  }
  
validateCoupon(){
  if(this.cart_items == ''){
    swal('',"please Select Atleast one product",'info');
    return false;
  }
  if(this.price_details == ''){
    swal("","Invalid product price","info")
    return false;
  }
  return true;
}

  applyCoupon(){
        
    if (this.LoginAuthService.isLoggednIn()){
      this.validateCoupon()      
      if(localStorage.getItem("appliedCoupon") == $('#prod-coupon').val()){
        swal("Success", "Coupon Already Applied", "info")
      }
      else{
      this.CartitemsService.applyCoupon({
        // product:this.cart_items[0].product.id, 
        product : this.cart_items[0].product.id, 
        coupon:$('#prod-coupon').val(),
        grand_total:this.price_details['grand_total']
      }).subscribe(response =>{
        console.log(response)
        swal("", response['message'], "success");
        this.price_details.coupon_applied = response['coupon_applied']
        localStorage.setItem("appliedCoupon", $('#prod-coupon').val())
        localStorage.setItem("updatedPrice", response['grand_total'])
        localStorage.setItem("coupon_applied", response['coupon_applied'])
        this.ifCoupon();
        this.price_details.grand_total = response['grand_total']
        this.CartitemsService.changeMessage('ok')
        },error =>{
          swal("Sorry!",error.error.message, "error");
        }
      )}
  
}else{
      swal("Login Required", "Login required for this action", "info");
    }
}

removeCoupon(){
  if (this.LoginAuthService.isLoggednIn()){
  this.CartitemsService.removeCoupon({
    grand_total:this.price_details['grand_total'],
    coupon_applied:this.price_details['coupon_applied']
  }).subscribe(res =>{
    swal("", res['message'], "success")  
    this.price_details.grand_total = res['grand_total']
    this.price_details.coupon_applied = res['coupon_applied']
    this.removeCouponValuesFromLocalStorage();
    this.ifCoupon();
    $('#prod-coupon').val('')
  })
  }
}


  changeCartQty(selected_qty, cart_id){
    if (this.LoginAuthService.isLoggednIn()){

      this.StylistDesignerService.change_cart_qty({
        cart_id:cart_id,
        quantity:selected_qty,
        coupon_applied:this.price_details.coupon_applied
      }).subscribe(response =>{
        swal("", response['message'], "success");
        this.price_details = response['price_details']
        this.CartitemsService.changeMessage('ok')
        this.removeCouponValuesFromLocalStorage();
        this.isCoupon = false;
        }),error=>{
          swal("Sorry!", "Something went wrong.", "error");
        }
    }else{
      swal("Login Required", "Login required for this action", "info");
    }
  }

  removeFromCart( cart_id){

    if (this.LoginAuthService.isLoggednIn()){

      this.StylistDesignerService.remove_from_cart(cart_id).subscribe(responase =>{
        // swal("", responase['message'], "success");
        // update cart items for localstorage
        this.StylistDesignerService.get_cart_item().subscribe(response =>{
          // save in local storage for further use
          window.localStorage.setItem('cart_items', JSON.stringify(response['cart_items']) )
          
          this.removeCouponValuesFromLocalStorage();
          this.isCoupon = false;

        }),error=>{
          swal("Sorry!", "Something went wrong.", "error");
        }
        this.StylistDesignerService.get_cart_item().subscribe(response =>{
          localStorage.setItem('cartCount',response['price_details']['items']);
          this.cart_items = response['cart_items']
          this.coupons = response['coupons']
          this.price_details = response['price_details']
          this.LoginAuthService.getUserData().cart_count = this.cart_items
          swal({title: "", text: "Item removed from cart.", type: "success"},
            function(){
                location.reload();
            }
          );
          // window.location.reload();
        }),error=>{
          swal("Sorry!", "Something went wrong.", "error");
        }
      }),error=>{
        swal("Sorry!", "Something went wrong.", "error");
      } 

    }else{
      swal("Login Required", "Login required for this action", "info");
    }
    
  
  }



  checkout(){

    if (this.cart_items.length!=0){
      this.router.navigate(['/checkout'])

    }else{

      return;
    } 
  }

}
