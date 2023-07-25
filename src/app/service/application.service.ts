import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { ApplicationModel } from "../model/application/application.model";
import { Observable } from "rxjs";
import { AddApplicationModel } from "../model/application/addapplication.model";
import { AddApplicationResponseModel } from "../model/application/applicationResponse.model";
import { CookieService } from "ngx-cookie-service";
import { AuthenticationService } from "./authen.service";


@Injectable({
    providedIn: 'root'
})

export class ApplicationService {

    public header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.cookieService.get('accesstoken'),
    })
    public appEmit = new EventEmitter();
    private baseUrl = "https://localhost:7277/api/Application";

    constructor(
        private httpClient: HttpClient,
        private cookieService:CookieService,
        private authenService:AuthenticationService,
    ) { }

    /**
     * Remove application API
     * @param id 
     * @returns 
     */
    removeApplication(id: number): Observable<boolean> {
        return this.httpClient.put<boolean>(this.baseUrl + "/Delete", id, {
            headers: this.authenService.header
        });
    }

    
    /**
     * Call add application API
     * @param data 
     * @returns 
     */
    addApplication(data: AddApplicationModel): Observable<AddApplicationResponseModel> {
        return this.httpClient.post<AddApplicationResponseModel>(this.baseUrl, JSON.stringify(data), {
            headers: this.authenService.header
        })
    }

    formatApplication(data: ApplicationModel[]) {
        data.forEach(element => {
            if (typeof (element.submissionDate) != 'string') {
                element.submissionDate = element.submissionDate.toDateString();
            }
        });
        return data;
    }

    /**
     * Get All application info
     * @returns 
     */
    getApplication(): Observable<ApplicationModel[]> {
        return this.httpClient.get<ApplicationModel[]>(this.baseUrl,{
            headers: this.authenService.header
        });
    }

    /**
     * Format application
     */
    formatData(data: ApplicationModel[]) {
        data.map(e => {
            e.submissionDate = new Date(e.submissionDate);
        })
        return data;
    }
}