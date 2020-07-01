import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginAuthService } from '../../services/authentication/loginauth.service'

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  getToken() {
    var authtoken = localStorage.getItem("LoggedInUserToken")
    return authtoken ? authtoken : ""
  }

  headers = new HttpHeaders({
    'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbjFAZ21haWwuY29tIiwidXNlcl9pZCI6ODUsImV4cCI6MTU4MjUzMTQ0Mn0.NIMr89rypWwNe_19lq4XX2_Ir5TM1kkrz1CQ87zLOzg',
    'Content-Type': 'application/json'
  })

  constructor(private http: HttpClient,
    private LoginAuthService: LoginAuthService) { }

  addCard(data) {
    return this.http.post(environment.baseUrl + '/api/v1/payment/add_card', data, this.LoginAuthService.get_header())
  }

  getSavedCards() {
    return this.http.get(environment.baseUrl + '/api/v1/payment/get_all_cards', this.LoginAuthService.get_header())
  }

  deleteCard(id) {
    return this.http.delete(environment.baseUrl + '/api/v1/payment/delete_card/'+id, this.LoginAuthService.get_header())
  }

  makePayment_PlaceOrder(data) {
    return this.http.post(environment.baseUrl + '/api/v1/payment/make_payment_and_place_order', data,
    this.LoginAuthService.get_header())
  }

  makePayment_ExchangeOrder(data) {
    return this.http.post(environment.baseUrl + '/api/v1/payment/make_payment_and_exchange_product', data,
    this.LoginAuthService.get_header())
  }

}

