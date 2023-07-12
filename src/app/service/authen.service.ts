import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { GetTokenResponse, SignInModel, SignInResponseModel, SignUpModel, SignUpResponseModel, TokenModel } from '../model/authen.model';
import { Observable, take,lastValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

    public token = '';
    public userName = '';
    private url = "https://localhost:7277/";

    constructor(
        private httpClient: HttpClient,
        private cookieService: CookieService,
        private helper: JwtHelperService,
        private toastr: ToastrService
    ) { }

    ngOnInit(){

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
        console.log("request new token");
        
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


        //do some thing while waiting the request

        // .pipe(take(1)).subscribe((res: GetTokenResponse) => {
        //     if (res.status == true) {
        //         this.cookieService.set('accesstoken', res.token);
        //         this.token = res.token;
        //         return true;
        //     }
        //     this.toastr.error(res.statusMessage);
        //     return false;
        // })
    }

    clearSession(){
        console.log(this.cookieService.get("accesstoken"));
        
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
            console.log(res);          
        });
        this.cookieService.delete("accesstoken");
        this.cookieService.delete("username");
        this.cookieService.delete("refreshtoken");
    }
}