import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './layout/home/home.component';
import { LoginComponent } from './shared/login/login.component';
import { ForgotpassformComponent} from './shared/forgotpassform/forgotpassform.component'
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';
import { OtpVerifyComponent } from './shared/otp-verify/otp-verify.component';
import { ProductCategoriesComponent } from './layout/product-categories/product-categories.component';
import { ProductDetailComponent } from './layout/product-detail/product-detail.component';
import { ReturnProductDetailComponent } from './layout/return-product-detail/return-product-detail.component';
import { ReturnProductDetailByColorComponent } from './layout/return-product-detail-by-color/return-product-detail-by-color.component';
import { ReturnProductProcessComponent } from './layout/return-product-process/return-product-process.component';
import { ReturnProductPaymentMethodComponent } from './layout/return-product-payment-method/return-product-payment-method.component';

import { ChatComponent } from './layout/chat/chat.component';
import { IndividualChatComponent } from './layout/individual-chat/individual-chat.component';
import { IChatLogComponent } from './layout/i-chat-log/i-chat-log.component';
import { VChatComponent } from './layout/v-chat/v-chat.component';
import { ProductListComponent } from './layout/product-list/product-list.component';
import { CartComponent } from './layout/cart/cart.component';
import { CheckoutComponent } from './layout/checkout/checkout.component';
import { PaymentMethodComponent } from './layout/payment-method/payment-method.component';
import { StyleListComponent } from './layout/style-list/style-list.component';
import { SavedCardsComponent } from './layout/saved-cards/saved-cards.component';
import { SavedAddressComponent } from './layout/saved-address/saved-address.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { OrdersComponent } from './layout/orders/orders.component';
import { OrderDetailComponent } from './layout/order-detail/order-detail.component';
import { RegisterComponent } from './shared/register/register.component'

import {DesignerListComponent } from './layout/designer-list/designer-list.component'
import { DesignerDetailComponent } from './layout/designer-detail/designer-detail.component'
import { StylistDetailComponent } from './layout/stylist-detail/stylist-detail.component'
import { StylistDesignerProductListComponent } from './layout/stylist-designer-product-list/stylist-designer-product-list.component'
import { ProductSubcategoryComponent } from './layout/product-subcategory/product-subcategory.component'

import { ProductSearchComponent } from './layout/product-search/product-search.component'

import { StylistDesignerProductDetailComponent } from './layout/stylist-designer-product-detail/stylist-designer-product-detail.component'

import { ProductDetailByColourComponent } from './layout/product-detail-by-colour/product-detail-by-colour.component'

import { StyDesProductDetailByColourComponent } from './layout/sty-des-product-detail-by-colour/sty-des-product-detail-by-colour.component'

import {WishlistComponent } from './layout/wishlist/wishlist.component'




const routes: Routes = ([
  {path:'', component:HomeComponent},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'forgot-password', component:ForgotPasswordComponent},
  {path:'change-password', component:ForgotpassformComponent},

  {path:'reset-password', component:ResetPasswordComponent},
  {path:'otp-verify', component:OtpVerifyComponent},
  {path:'product-categories/:id', component:ProductCategoriesComponent},
 
  {path:'cart', component:CartComponent},
  {path:'wishlist', component:WishlistComponent},

  {path:'checkout', component:CheckoutComponent},
  {path:'payment-method', component:PaymentMethodComponent},
  
  {path:'profile', component:ProfileComponent},
  {path:'saved-cards', component:SavedCardsComponent},
  {path:'saved-address', component:SavedAddressComponent},
  {path:'orders', component:OrdersComponent},
  {path:'order-detail/:id', component:OrderDetailComponent},

  {path:'stylist-list', component:StyleListComponent},
  // {path:'designer-list', component:DesignerListComponent},

  {path:'designer-list', component:DesignerListComponent},
  {path:'designer-detail/:id', component:DesignerDetailComponent},
  {path:'stylist-detail/:id', component:StylistDetailComponent},
  {path:'product-list/:id', component:StylistDesignerProductListComponent},
  {path:'product-details/:profile_id/:id', component:StylistDesignerProductDetailComponent},


  {path:'product-details-bycolour/:profile_id/:product_id/:colour_id', component:ProductDetailByColourComponent},
  

//manufacturer

  {path:'product-subcategories/:cat_id/:subcat_id', component:ProductSubcategoryComponent},
  {path:'product-list/:cat_id/:subcat_id/:subsubcat_id', component:ProductListComponent},

  {path:'product/search/:searchString', component:ProductSearchComponent},
  {path:'product-detail/:id', component:ProductDetailComponent},

  {path:'return-product-detail/:product_id/:order_id', component:ReturnProductDetailComponent},
  {path:'return-product-detail-bycolor/:product_id/:colour_id/:order_id', component:ReturnProductDetailByColorComponent},
  {path:'return-product-process/:order_id/:image_id/:size_id', component:ReturnProductProcessComponent},
  {path:'exchange-payment-method', component:ReturnProductPaymentMethodComponent},
  {path:'chat', component:ChatComponent},
  {path:'i-chat',component:IndividualChatComponent},
  {path:'i-chat-log',component:IChatLogComponent},
  {path:'av-chat/:call_type/:origin',component:VChatComponent},

  {path:'product-detail-bycolour/:product_id/:colour_id', component:StyDesProductDetailByColourComponent},


  // {path:'**', component:HomeComponent},
]);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }