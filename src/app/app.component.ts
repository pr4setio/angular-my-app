import { Component } from '@angular/core';
import { AuthenticationService } from './services';
import { User } from './models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  existingUser: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
) {
    this.authenticationService.existingUser.subscribe(x => this.existingUser = x);
}

logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}
}
