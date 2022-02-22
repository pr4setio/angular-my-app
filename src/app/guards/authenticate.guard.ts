import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@app/services';

@Injectable({ providedIn: 'root' })
export class AuthenticateGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, snap: RouterStateSnapshot) {
        const existingUser = this.authenticationService.existingUserValue;
        if (existingUser) {
            return true;
        }

        this.router.navigate(['/login'],
            { queryParams: { originalUrl: snap.url } });
        return false;
    }
}