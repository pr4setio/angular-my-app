import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards';
import { RegisterComponent } from './register/register.component';
import { EmployeeComponent } from './employee/employee.component';


const appRoutes: Routes = [
    { path: '', component: EmployeeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    // other can redirect to Home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);