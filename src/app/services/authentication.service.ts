import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private existingUserSubject: BehaviorSubject<User>;
    public existingUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.existingUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('existingUser')));
        this.existingUser = this.existingUserSubject.asObservable();
    }

    public get existingUserValue(): User {
        return this.existingUserSubject.value;
    }

    logout() {
        localStorage.removeItem('existingUser');
        this.existingUserSubject.next(null);
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                if (user && user.token) {
                    localStorage.setItem('existingUser', JSON.stringify(user));
                    this.existingUserSubject.next(user);
                }
                return user;
            }));
    }
}