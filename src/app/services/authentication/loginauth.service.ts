
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class LoginAuthService {


    constructor(private myRoute: Router,

        
        ) { }


    getUserDetails() {
        //debugger;
        //var decoded = jwt.decode(this.getToken());
        var decoded = jwt_decode(this.getToken());
        var user: any = {}
        user.email = decoded.email;
        user.firstname = decoded.fname;
        user.lastname = decoded.lname;
        user.dp = "avatar.jpg"
        return user;
    }

    setUser(payload){
        payload = JSON.stringify(payload);
        localStorage.setItem("admin_user", payload);
    }

    sendToken(token: string) {
        localStorage.setItem("LoggedInUserToken", token);
    }

    sendTokenForVarification(token: string) {
        localStorage.setItem("VarificationUserToken", token);
    }

    getToken() {
        var authtoken = localStorage.getItem("LoggedInUserToken")
        return authtoken ? authtoken : ""
    }
    getTokenForVarification() {
        var authtoken = localStorage.getItem("VarificationUserToken")
        return authtoken ? authtoken : ""
    }

    isLoggednIn() {
        //console.log(jsonToken.verify(this.getToken()))
        let token = this.getToken();
        if (token) {
            // var decoded = jwt_decode(this.getToken());
            // if (Date.now() / 1000 > decoded.exp) {
            //     return false;
            // }
            // return true;
            return true
        }
        else{
            return false;
        }
    }


    getUser() {
        return JSON.parse(localStorage.getItem("adminData"));
    }


    logout() {
        localStorage.removeItem("LoggedInUserToken");
        localStorage.removeItem("userData");

        // localStorage.removeItem("adminData");
        this.myRoute.navigate(["/login"]);
    }

    removeTokenForVarification() {
        localStorage.removeItem("VarificationUserToken");
    }
    remove_phone_and_code(){
        localStorage.removeItem("phonenumber");
        localStorage.removeItem("countycode");

    }
    setUserData(userDate){
        localStorage.setItem("userData", JSON.stringify(userDate));
    }
    getUserData(){
        return JSON.parse(localStorage.getItem("userData"));
    }

    set_phone_and_code(phonenumber: string, countrycode:string){
        localStorage.setItem("phonenumber", phonenumber);
        localStorage.setItem("countycode", countrycode);

    }
    isPhoneAndCode(){

        let phonenumber = this.get_from_sessionstorage('phonenumber');
        let countrycode = this.get_from_sessionstorage('countycode')
        if (phonenumber && countrycode){
            return true
        }
        else{
            return false;
        }
    }


    get_from_sessionstorage(any: string,){
        var variable = localStorage.getItem(any)
        return variable

    }


    get_header(){
        let headers = new HttpHeaders();
        if (this.getToken()==''){
          headers = headers.set("Authorization","");
          return {headers}
    
        }else{
          headers = headers.set("Authorization", "JWT " + this.getToken());
          return {headers}
        }
    
    }
    
}