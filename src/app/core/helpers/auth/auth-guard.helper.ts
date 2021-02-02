import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthClientHelper } from './auth-client.helper';

@Injectable()
export class AuthGuardService {
    constructor(private router: Router, private _auth: AuthClientHelper) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this._auth.isGuest() && state.url !== '/login') {
            this.router.navigate(['/login']);
        }

        if (!this._auth.isGuest() && state.url === '/login') {
            this.router.navigate(['/home']);
        }

        return true;
    }
}