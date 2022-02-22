import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<any>();
    private stayHere = false;

    constructor(private router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.stayHere) {
                    this.stayHere = false;
                } else {
                    this.subject.next();
                }
            }
        });
    }

    success(message: string, stayHere = false) {
        this.stayHere = stayHere;
        this.subject.next({ type: 'success', text: message });
    }

    error(message: string, stayHere = false) {
        this.stayHere = stayHere;
        this.subject.next({ type: 'error', text: message });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}