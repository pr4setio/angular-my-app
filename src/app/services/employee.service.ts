import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Employee[]>(`${environment.apiUrl}/employees`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/employees/${id}`);
    }

    register(employee: Employee) {
        return this.http.post(`${environment.apiUrl}/employees/register`, employee);
    }

    update(employee: Employee) {
        return this.http.put(`${environment.apiUrl}/employees/${employee.id}`, employee);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/employees/${id}`);
    }
}