import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './shared/login/login.component';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';
import { OtpVerifyComponent } from './shared/otp-verify/otp-verify.component';
import { HeaderComponent } from './comman/header/header.component';
import { FooterComponent } from './comman/footer/footer.component';
import { LoaderComponent } from './comman/loader/loader.component';

import { LeftSidebarComponent } from './comman/left-sidebar/left-sidebar.component';
import { HomeComponent } from './layout/home/home.component';
import { ProductListComponent } from './layout/product-list/product-list.component';
import { ProductDetailComponent } from './layout/product-detail/product-detail.component';
import { ProductCategoriesComponent } from './layout/product-categories/product-categories.component';
import { CartComponent } from './layout/cart/cart.component';
import { CheckoutComponent } from './layout/checkout/checkout.component';
import { PaymentMethodComponent } from './layout/payment-method/payment-method.component';
import { StyleListComponent } from './layout/style-list/style-list.component';
import { OrderDetailComponent } from './layout/order-detail/order-detail.component';
import { OrdersComponent } from './layout/orders/orders.component';
import { ProfileComponent } from './layout/profile/profile.component';
import { SavedAddressComponent } from './layout/saved-address/saved-address.component';
import { SavedCardsComponent } from './layout/saved-cards/saved-cards.component';


import { LoginService } from './services/authentication/login.service'
import { LoginAuthService } from './services/authentication/loginauth.service';
import { StylistDesignerService} from './services/stylist-designer/stylist-designer.service'

import { ForgotpassformComponent } from './shared/forgotpassform/forgotpassform.component';
import { RegisterComponent } from './shared/register/register.component';
import { DesignerListComponent } from './layout/designer-list/designer-list.component';
import { StylistDetailComponent } from './layout/stylist-detail/stylist-detail.component';
import { DesignerDetailComponent } from './layout/designer-detail/designer-detail.component';
import { StylistDesignerProductListComponent } from './layout/stylist-designer-product-list/stylist-designer-product-list.component';
import { ManufacturerService } from './services/manufacturer/manufacturer.service';
import { ProductSubcategoryComponent } from './layout/product-subcategory/product-subcategory.component';
import { ProductSearchComponent } from './layout/product-search/product-search.component';
import { StylistDesignerProductDetailComponent } from './layout/stylist-designer-product-detail/stylist-designer-product-detail.component';
import { ProductDetailByColourComponent } from './layout/product-detail-by-colour/product-detail-by-colour.component';
import { StyDesProductDetailByColourComponent } from './layout/sty-des-product-detail-by-colour/sty-des-product-detail-by-colour.component';
import { WishlistComponent } from './layout/wishlist/wishlist.component'
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { CartitemsService } from './services/cartitems/cartitems.service'
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentcardComponent } from './layout/paymentcard/paymentcard.component';
import { ReturnProductDetailComponent } from './layout/return-product-detail/return-product-detail.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MessagingService } from './services/messaging/messaging.service';
import { AsyncPipe } from '../../node_modules/@angular/common';

import { environment } from '../environments/environment';
import { ChatComponent } from './layout/chat/chat.component';
import { ReturnProductDetailByColorComponent } from './layout/return-product-detail-by-color/return-product-detail-by-color.component';
import { ReturnProductProcessComponent } from './layout/return-product-process/return-product-process.component';
import { ReturnProductPaymentMethodComponent } from './layout/return-product-payment-method/return-product-payment-method.component';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { IndividualChatComponent } from './layout/individual-chat/individual-chat.component';
import { IChatLogComponent } from './layout/i-chat-log/i-chat-log.component';


import { AngularAgoraRtcModule, AgoraConfig } from 'angular-agora-rtc';
import { VChatComponent } from './layout/v-chat/v-chat.component';
const agoraConfig: AgoraConfig = {
  AppID: 'sdfsd',
};




@NgModule({
  declarations: [
    AppComponent,
    ProductDetailByColourComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    OtpVerifyComponent,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    LeftSidebarComponent,
    HomeComponent,
    ProductListComponent,
    ProductDetailComponent,
    ProductCategoriesComponent,
    CartComponent,
    CheckoutComponent,
    PaymentMethodComponent,
    StyleListComponent,
    OrderDetailComponent,
    OrdersComponent,
    ProfileComponent,
    SavedAddressComponent,
    SavedCardsComponent,

    ForgotpassformComponent,

    RegisterComponent,

    DesignerListComponent,

    StylistDetailComponent,

    DesignerDetailComponent,

    StylistDesignerProductListComponent,

    ProductSubcategoryComponent,

    ProductSearchComponent,

    StylistDesignerProductDetailComponent,

    StyDesProductDetailByColourComponent,

    WishlistComponent,

    PaymentcardComponent,

    ReturnProductDetailComponent,

    ChatComponent,

    ReturnProductDetailByColorComponent,

    ReturnProductProcessComponent,

    ReturnProductPaymentMethodComponent,

    IndividualChatComponent,

    IChatLogComponent,

    VChatComponent,

    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    GooglePlaceModule,
    NgxStripeModule.forRoot('dfsdf'),   
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule, 
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularAgoraRtcModule.forRoot(agoraConfig)

  ],
  providers: [
    LoginService,
    LoginAuthService,
    StylistDesignerService,
    ManufacturerService,
    CartitemsService,
    MessagingService,
    AsyncPipe

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }