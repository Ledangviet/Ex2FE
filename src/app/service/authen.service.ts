import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

import { Observable, take,lastValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { TokenModel } from '../model/authentication/token.model';
import { GetTokenResponse } from '../model/authentication/gettokenresponse.model';
import { SignInModel } from '../model/authentication/signin.model';
import { SignInResponseModel } from '../model/authentication/signinresponse.model';
import { SignUpModel } from '../model/authentication/signup.model';
import { SignUpResponseModel } from '../model/authentication/signupresonse.model';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    public header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.cookieService.get('accesstoken'),
    })
    public token = '';
    public userName = '';
    private url = "https://localhost:7277/";

    constructor(
        private httpClient: HttpClient,
        private cookieService: CookieService,
        private helper: JwtHelperService,
    ) { }

    ngOnInit(){

    }

    /**
     * Refresh base header 
     */
    refreshToken(){             
        this.header = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.cookieService.get('accesstoken'),
        })
    }

    /**
     * Check login information
     * @returns 
     */
    public async loginCheck() {
        
        this.token = this.cookieService.get('accesstoken');
        this.userName = this.cookieService.get('username');
        if(!this.token) return false;
        //return true if token is not expired
        if (!this.helper.isTokenExpired(this.token)) {
            return true;
        }
        //send request if token is expired
        
        var model = new TokenModel();
        model.accessToken = this.token;
        model.refreshToken = this.cookieService.get('refreshtoken');
        model.userName = this.userName;

        setTimeout(()=>{
            return false;
        },10000);
        
        var resmodel = await lastValueFrom<GetTokenResponse>(this.getToken(model))      
        if(resmodel.status == true)
        return true;
        return false;
    }

    /**
     * Clear login session
     * @returns 
     */
    clearSession(){       
        return this.httpClient.put(this.url+"api/Authentication/signout",{},{
            headers: new HttpHeaders({
              'Authorization': 'Bearer ' + this.cookieService.get("accesstoken")
            })
          })
    }

    /**
     * Request new access token
     * @param model 
     * @returns 
     */
    getToken(model: TokenModel) {
        return this.httpClient.put<GetTokenResponse>(this.url + "api/Authentication/token", model);
    }


    /**
     * call login api with singin model
     * @param model 
     * @returns 
     */
    login(model: SignInModel): Observable<SignInResponseModel> {
        return this.httpClient.post<SignInResponseModel>(this.url + "SignIn", model);
    }

    /**
     * call signUp api with signup model
     * @param model 
     * @returns 
     */
    register(model: SignUpModel): Observable<SignUpResponseModel> {
        return this.httpClient.post<SignUpResponseModel>(this.url + "SignUp", model);
    }

    /**
     * remove login info from cookie
     */
    logOut() {    
        this.clearSession().subscribe(res => {       
        });
        this.cookieService.delete("accesstoken");
        this.cookieService.delete("username");
        this.cookieService.delete("refreshtoken");
    }
}