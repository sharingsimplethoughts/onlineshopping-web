import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginAuthService } from '../../services/authentication/loginauth.service'


@Injectable({
    providedIn: 'root'
})

export class LoginService {
    constructor(
        private http: HttpClient,
        private LoginAuthService :LoginAuthService
    ) { }
    
    // login

    login(val) {
        return this.http.post(environment.baseUrl + '/api/v1/users/login/', val)
    }
    logout(){
        return this.http.get(environment.baseUrl + '/api/v1/users/logout',{ headers:new HttpHeaders().set("Authorization", "JWT " + this.LoginAuthService.getToken())})
    }

    // register

    register_and_otp_create(val) {
        return this.http.post(environment.baseUrl + '/api/v1/users/register/otp/generate/', val)
    }
    otp_varify(val) {
        return this.http.post(environment.baseUrl + '/api/v1/users/otp/verify/' ,val, { headers:new HttpHeaders().set("Authorization",  "JWT "+this.LoginAuthService.getTokenForVarification())})
    }
    // otp_varify(val) {
    //     return this.http.post(environment.baseUrl + '/api/v1/users/otp/verify/' ,val, { headers:new HttpHeaders().set("Authorization",  "JWT "+this.LoginAuthService.getTokenForVarification())})
    // }
    otp_regenerate(val) {
        return this.http.post(environment.baseUrl + '/api/v1/users/otp/regenerate/', val)
    }

    // change password

    changepassword(val) {
        return this.http.put(environment.baseUrl + '/api/v1/users/changepassword/', val, { headers:new HttpHeaders().set("Authorization", "JWT " + this.LoginAuthService.getToken())})
    }


    // password reset by phone

    reset_pass_otp_generate(val) {
        return this.http.post(environment.baseUrl + '/api/v1/users/otp/generate/password/reset/', val )
    }
    reset_pass_otp_verify(val) {
        return this.http.post(environment.baseUrl + '/api/v1/users/otp/verify/password/reset/', val)
    }
    reset_pass(val) {
        return this.http.post(environment.baseUrl + '/api/v1/users/password/reset/byotp/', val, { headers:new HttpHeaders().set("Authorization", "JWT " + this.LoginAuthService.getTokenForVarification())})
    }


    //profile data

    getProfile() {
        return this.http.get(environment.baseUrl + '/api/v1/users/webuser/profile',{ headers:new HttpHeaders().set("Authorization", "JWT " + this.LoginAuthService.getToken())})
      }
    updateProfile(val) {
        return this.http.post(environment.baseUrl + '/api/v1/users/webuser/profile',val,{ headers:new HttpHeaders().set("Authorization", "JWT " + this.LoginAuthService.getToken())})
      }



    upload_chat_file(data){
        return this.http.post(environment.baseUrl + '/api/v1/order/save_file',data)
    }


}
