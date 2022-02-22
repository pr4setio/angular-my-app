import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '@app/services';

@Component({
    selector: 'notification',
    templateUrl: 'notification.component.html'
})

export class NotificationComponent implements OnInit, OnDestroy {
    private subscribe: Subscription;
    notif: any;

    constructor(private notificationService: AlertService) { }

    ngOnInit() {
        this.subscribe = this.notificationService.getMessage()
        .subscribe(message => { 
            this.notif = message; 
        });
    }

    ngOnDestroy() {
        this.subscribe.unsubscribe();
    }
}