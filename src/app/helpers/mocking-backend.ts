import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class MockingAPIRest implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

        return of(null).pipe(mergeMap(() => {

            // authenticate user
            if (req.url.endsWith('/users/authenticate') && req.method === 'POST') {
                let getAllUsers = users.filter(user => {
                    return user.username === req.body.username && user.password === req.body.password;
                });
                if (getAllUsers.length) {
                    let user = getAllUsers[0];
                    let body = {
                        id: user.id,
                        username: user.username,
                        token: 'mocking-jwt-token'
                    };

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    return throwError({ error: { message: 'incorrect Username or password' } });
                }
            }

            // get users
            if (req.url.endsWith('/users') && req.method === 'GET') {
                if (req.headers.get('Authorization') === 'mocking-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    return throwError({ status: 401, error: { message: 'User Unauthorised' } });
                }
            }

            // get user by id
            if (req.url.match(/\/users\/\d+$/) && req.method === 'GET') {
                if (req.headers.get('Authorization') === 'mocking-jwt-token') {
                    let urlReq = req.url.split('/');
                    let id = parseInt(urlReq[urlReq.length - 1]);
                    let equalUsers = users.filter(user => { return user.id === id; });
                    let user = equalUsers.length ? equalUsers[0] : null;

                    return of(new HttpResponse({ status: 200, body: user }));
                } else {
                    return throwError({ status: 401, error: { message: 'User Unauthorised' } });
                }
            }

            // register user
            if (req.url.endsWith('/users/register') && req.method === 'POST') {
                let newUser = req.body;

                // validation
                let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                if (duplicateUser) {
                    return throwError({ error: { message: 'Username "' + newUser.username + '" is already register' } });
                }

                // save new user
                newUser.id = users.length + 1;
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                return of(new HttpResponse({ status: 200 }));
            }

            // delete user
            if (req.url.match(/\/users\/\d+$/) && req.method === 'DELETE') {
                if (req.headers.get('Authorization') === 'mocking-jwt-token') {
                    let urlReq = req.url.split('/');
                    let id = parseInt(urlReq[urlReq.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    return of(new HttpResponse({ status: 200 }));
                } else {
                    return throwError({ status: 401, error: { message: 'User Unauthorised' } });
                }
            }

            return next.handle(req);

        }))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
    }
}

export let mockingApi = {
    provide: HTTP_INTERCEPTORS,
    useClass: MockingAPIRest,
    multi: true
};