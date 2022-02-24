import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AlertService, UserService } from '@app/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  get form() { return this.registerForm.controls; }

  initForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required,Validators.minLength(5),Validators.maxLength(12)]),
      password: new FormControl('', [Validators.required,Validators.minLength(5),Validators.maxLength(8)])
    });
  }

  registerUser() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }
    this.userService.register(this.registerForm.value)
    .pipe(first())
    .subscribe(
        data => {
            this.alertService.success('Registration successful', true);
            this.router.navigate(['/login']);
        },
        error => {
            this.alertService.error(error);
        });

  }

  cancel() {
    this.router.navigate(['/']);
  }

}
