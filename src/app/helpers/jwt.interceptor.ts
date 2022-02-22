import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/services';

@Injectable()
export class JwtHandler implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let existingUser = this.authenticationService.existingUserValue;
        if (existingUser && existingUser.token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `${existingUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}