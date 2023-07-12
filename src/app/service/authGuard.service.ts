import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "./authen.service";

@Injectable({
    providedIn: 'root'
})
class PermissionsService {

    constructor(
        private router: Router,
        private authenService: AuthenticationService
    ) { }

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        if (await this.authenService.loginCheck()) return true
        this.router.navigate(['/login']);
        return false
    }
}

export const AuthGuard: CanActivateFn = async (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
    return await inject(PermissionsService).canActivate(next, state);
}




