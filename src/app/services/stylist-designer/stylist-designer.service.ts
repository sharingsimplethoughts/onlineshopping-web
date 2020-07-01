import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginAuthService } from '../../services/authentication/loginauth.service'

@Injectable({
  providedIn: 'root'
})
export class StylistDesignerService {

  constructor(

    private http: HttpClient,
    private LoginAuthService :LoginAuthService

  ) { }




  getstylist_list() {
    return this.http.get(environment.baseUrl + '/api/v1/profile/list/stylist')
  }

  getdesigner_list() {
    return this.http.get(environment.baseUrl + '/api/v1/profile/list/designer')
  }
  
  getdesigner_detail(id) {
    return this.http.get(environment.baseUrl + '/api/v1/profile/list/designer/web/'+id, this.LoginAuthService.get_header())
  }

  getstylist_detail(id) {
    return this.http.get(environment.baseUrl + '/api/v1/profile/list/stylist/web/'+id ,this.LoginAuthService.get_header())
  }

  getstylist_designer_product_list(id,offer,price_min,price_max,size,colour,category,subcategory,subsubcategory,ordering) {
    return this.http.get(environment.baseUrl + '/api/v1/profile/list/product/web/'+id +'?offer='+offer+
    '&price_min='+price_min+'&price_max='+price_max+'&size='+size+'&colour='+colour+'&category='+category+'&subcategory='+subcategory+'&subsubcategory='+subsubcategory+
    '&ordering='+ordering, this.LoginAuthService.get_header())

  }
  getproduct_detail(profile_id,id) {
    return this.http.get(environment.baseUrl + '/api/v1/profile/detail/product/'+profile_id+'/'+id+'/', this.LoginAuthService.get_header())
  }
  getProducts_images(product_id ,varient_id) {
    return this.http.get(environment.baseUrl +  '/api/v1/product/detail_by_colour/'+product_id+'/'+varient_id, this.LoginAuthService.get_header())
  }
  getproduct_detail_bycolour(profile_id,product_id,colour_id) {
    return this.http.get(environment.baseUrl + '/api/v1/profile/detail/product/bycolur/'+profile_id+'/'+product_id+'/'+colour_id, this.LoginAuthService.get_header())
  }

  add_to_wishlist(val) {
    return this.http.post(environment.baseUrl + '/api/v1/product/wishlist/', val, this.LoginAuthService.get_header())
  }

  remove_from_wishlist(product_id) {
    return this.http.delete(environment.baseUrl + '/api/v1/product/wishlist/'+ product_id, this.LoginAuthService.get_header())
  }

  get_wishlist_item(){
    return this.http.get(environment.baseUrl + '/api/v1/product/wishlist/', this.LoginAuthService.get_header())
  }

  add_in_cart(data){
    return this.http.post(environment.baseUrl + '/api/v1/product/cart/', data, this.LoginAuthService.get_header())
  }

  get_cart_item(){
    return this.http.get(environment.baseUrl + '/api/v1/product/cart/', this.LoginAuthService.get_header())
  }

  change_cart_qty(data){
    return this.http.post(environment.baseUrl + '/api/v1/product/change_cart_qty/', data, this.LoginAuthService.get_header())
  }

  remove_from_cart(cart_id){
    return this.http.delete(environment.baseUrl + '/api/v1/product/cart/'+cart_id,  this.LoginAuthService.get_header())
  }

  get_all_address(){
    return this.http.get(environment.baseUrl + '/api/v1/order/deliver_address', this.LoginAuthService.get_header())
  }

  add_new_address(data){
    return this.http.post(environment.baseUrl + '/api/v1/order/deliver_address', data, this.LoginAuthService.get_header())
  }

  get_an_address(address_id){
    return this.http.get(environment.baseUrl + '/api/v1/order/deliver_address/'+address_id, this.LoginAuthService.get_header())
  }

  edit_address(data, address_id){
    return this.http.put(environment.baseUrl + '/api/v1/order/deliver_address/'+address_id, data, this.LoginAuthService.get_header())
  }
  delete_an_address(address_id){
    return this.http.delete(environment.baseUrl + '/api/v1/order/deliver_address/'+address_id,  this.LoginAuthService.get_header())
  }

  // https://maps.googleapis.com/maps/api/geocode/json?latlng=44.4647452,7.3553838&key=YOUR_API_KEY


  get_order_list(){
    return this.http.get(environment.baseUrl + '/api/v1/order/orders_history_web', this.LoginAuthService.get_header())
  }

  // *********************Sukamal Added-----------
  get_order_detail(order_id){
    return this.http.get(environment.baseUrl + '/api/v1/order/orders_history/'+order_id, this.LoginAuthService.get_header())
  }
  set_return_product(data){
    return this.http.post(environment.baseUrl + '/api/v1/order/return_order', data, this.LoginAuthService.get_header())
  }
  set_exchange_product(data){
    return this.http.post(environment.baseUrl + '/api/v1/order/exchange_order', data, this.LoginAuthService.get_header())
  }
  // set_exchange_msg(data){
  //   return this.http.post(environment.baseUrl + '/api/v1/order/set_temp_response', data, this.LoginAuthService.get_header())
  // }
  // get_exchange_msg(id){
  //   return this.http.get(environment.baseUrl + '/api/v1/order/get_temp_response/'+id, this.LoginAuthService.get_header())
  // }
  set_rating(data){
    return this.http.post(environment.baseUrl + '/api/v1/order/rate_a_product', data, this.LoginAuthService.get_header())
  }

  set_call_notification(data){
    // return this.http.post(environment.baseUrl + '/api/v1/chat/send_notification_for_call', data, this.LoginAuthService.get_header())
    return this.http.post(environment.baseUrl + '/api/v1/chat/send_notification_for_call_url', data, this.LoginAuthService.get_header())
  }
}