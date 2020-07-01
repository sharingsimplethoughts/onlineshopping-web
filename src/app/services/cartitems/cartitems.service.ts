import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginAuthService } from '../../services/authentication/loginauth.service'


@Injectable({providedIn: 'root'})
export class CartitemsService {

  
  
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor(private http:HttpClient,
    private LoginAuthService :LoginAuthService) {}

    changeMessage(message: string) {
      this.messageSource.next(message)
    }
  
    applyCoupon(data){
      return this.http.post(environment.baseUrl + '/api/v1/product/coupon_apply/', data,this.LoginAuthService.get_header())
    }

    removeCoupon(data){
      return this.http.post(environment.baseUrl + '/api/v1/product/coupon_remove/', data, this.LoginAuthService.get_header())
    }
    

  
}

