import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from "@angular/router";
import { AlertService, AuthenticationService } from '@app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string;
  originalUrl: string;
  submitted: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
    ) {
      if (this.authenticationService.existingUserValue) { 
        this.router.navigate(['/']);
    }
    }

  ngOnInit() {
    this.initForm();
    this.originalUrl = this.route.snapshot.queryParams['originalUrl'] || '/';
  }

  get form() { return this.loginForm.controls; }

  initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  loginUser() {
    this.submitted = true;
    if (this.loginForm.invalid) {
        return;
    }
    this.authenticationService.login(this.form.username.value, this.form.password.value)
    .pipe(first())
    .subscribe(
        data => {
            this.router
            .navigate([this.originalUrl]);
        },
        error => {
            this.alertService.error(error);
        });
  }

  register() {
    this.router.navigate(['/register']);
  }

}
