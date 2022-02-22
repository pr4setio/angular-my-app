import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee/employee.component';
import { mockingApi, JwtHandler, ErrorHandler } from './helpers';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routing } from './app.routing';
import { NotificationComponent } from './shared';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmployeeComponent,
    NotificationComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    routing
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtHandler, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandler, multi: true },

    mockingApi
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
