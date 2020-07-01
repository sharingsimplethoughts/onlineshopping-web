import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginAuthService } from '../../services/authentication/loginauth.service'


@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  constructor(
    private http: HttpClient,
    private LoginAuthService :LoginAuthService
  ) { }

  getcategory_list() {
    return this.http.get(environment.baseUrl + '/api/v1/product/category')
  }

  getsubcategory_list(cat_id) {
    return this.http.get(environment.baseUrl +   '/api/v1/product/subcategory/'+cat_id+'/')
  }

  getsubsubcategory_list(cat_id,subcat_id) {
    return this.http.get(environment.baseUrl +   '/api/v1/product/subsubcategory/'+cat_id+'/'+subcat_id+'/')
  }



  getHomeProducts_list() {
    return this.http.get(environment.baseUrl +  '/api/v1/product/web_home_page')
  }

  // getSearchProduct_list(searchString,ordering,offer,size,price_min,price_max) {
  //   return this.http.get(environment.baseUrl +  '/api/v1/product/search_web?search=' +searchString+'&ordering='+ 
  //   ordering+'&offer='+offer+'&price_max='+price_max+'&price_min='+price_min+'&size='+size+
  // }

  getSearchProduct_list(searchString,offer,price_min,price_max,size,colour,category,subcategory,subsubcategory,ordering) {
    return this.http.get(environment.baseUrl + 
      '/api/v1/product/search_web?search='+searchString+'&offer='+offer+
      '&price_min='+price_min+'&price_max='+price_max+'&size='+size+'&colour='+colour+'&category='+category+'&subcategory='+subcategory+'&subsubcategory='+subsubcategory+
      '&ordering='+ordering, this.LoginAuthService.get_header())
  }


  getproducts_list(cat_id,subcat_id,subsubcat_id,offer,price_min,price_max,size,colour,category,subcategory,subsubcategory,ordering) {
    return this.http.get(environment.baseUrl +   '/api/v1/product/'+cat_id+'/'+subcat_id+'/' +subsubcat_id+ '/?offer='+offer+
    '&price_min='+price_min+'&price_max='+price_max+'&size='+size+'&colour='+colour+'&category='+category+'&subcategory='+subcategory+'&subsubcategory='+subsubcategory+
    '&ordering='+ordering, this.LoginAuthService.get_header())
  }
  // '&category='+category+'&subcategory='+subcategory+'&subsubcategory='+subsubcategory+

  getProducts_details(id) {
    return this.http.get(environment.baseUrl +  '/api/v1/product/web/detail/'+id+'/', this.LoginAuthService.get_header())
  }

  // getProducts_images(product_id ,varient_id) {
  //   return this.http.get(environment.baseUrl +  '/api/v1/product/detail_by_colour/'+product_id+'/'+varient_id, this.LoginAuthService.get_header())
  // }
  

  getProducts_images(product_id ,varient_id) {
    return this.http.get(environment.baseUrl +  '/api/v1/product/web/detail/by_colour/'+product_id+'/'+varient_id, this.LoginAuthService.get_header())
  }

  get_current_geoaddress(lat, long){
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&key=AIzaSyB6XxbBO6mWn2CxFqo7kgUXTFSK9le406Y')
  }
}