import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, EmployeeService, AlertService } from '@app/services';
import { first } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { Moment } from 'moment';
const moment = _moment;
declare let $: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  dataSource: MatTableDataSource<Employee>;
  displayedColumns: any;
  formControl: AbstractControl;
  filterForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  addEmployeeForm: FormGroup;
  maxDate: Moment;
  listGroup: { label: string; value: string; }[];
  listStatus: { label: string; value: string; }[];
  submitted: boolean;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private employeeService: EmployeeService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.fetchDataTable();
    this.initFormFilter();
    this.initAddEmployeeForm();
  }

  initAddEmployeeForm() {
    this.listGroup = [
      { label: 'IT', value: 'it' },
      { label: 'FINANCE', value: 'finance' },
      { label: 'RISK', value: 'risk' },
      { label: 'GA', value: 'ga' },
      { label: 'BACK OFFICE', value: 'backoffice' },
      { label: 'IT2', value: 'it2' },
      { label: 'IT3', value: 'it3' },
      { label: 'IT4', value: 'it4' },
      { label: 'IT5', value: 'it5' },
      { label: 'IT6', value: 'it6' },
    ];
    this.listStatus = [
      { label: 'ACTIVE', value: 'active' },
      { label: 'INACTIVE', value: 'incative' },
    ]
    const currentDate = moment().date();
    this.maxDate = moment([currentDate]);
    console.log("this.maxDate", this.maxDate);
    this.addEmployeeForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]),
      firstname: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(12)]),
      birthdate: new FormControl('', [Validators.required]),
      basicsalary: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]),
      group: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(12)])
    });
  }

  initFormFilter() {
    this.filterForm = new FormGroup({
      username: new FormControl(''),
      email: new FormControl('')
    });
    this.filterForm.valueChanges.subscribe(value => {
      const filter = { ...value, username: value.username.trim().toLowerCase() } as string;
      this.dataSource.filter = filter;
    });
  }

  fetchDataTable() {
    this.displayedColumns = ['id', 'username', 'firstname', 'lastname', 'email', 'birthdate', 'basicsalary', 'status', 'group', 'description', 'actionsColumn'];
    this.employeeService.getAll()
      .pipe(first())
      .subscribe(
        data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.dataSource.filterPredicate = ((data, filter) => {
            const a = !filter.username || data.username.toLowerCase().includes(filter.username);
            const b = !filter.email || data.email.toLowerCase().includes(filter.email);
            return a && b;
          }) as (PeriodicElement, string) => boolean;
          this.alertService.success('Get Data successful', false);
          this.router.navigate(['/']);
        },
        error => {
          this.alertService.error(error);
        });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  refresh() {
    this.fetchDataTable();
  }

  addEmployee() {
    $('#popupAddEmployee').modal('show');

  }

  addNew() {
    const success = 'Add New User Successfull';
    this.alertService.success(success);
    this.closeModal();
  }

  edit() {
    const success = 'Edit User Successfull';
    this.alertService.success(success);
  }

  delete() {
    const error = 'Delete User Successfull';
    this.alertService.error(error);
  }

  closeModal() {
    $('#popupAddEmployee').modal('hide');
    this.addEmployeeForm.reset();
  }

  clearLocalStorage() {
    localStorage.removeItem('employees');
    this.refresh();
  }

  generateDummyEmployee() {
    let totalData = 100;
    for (let i = 0; i < totalData; i++) {
      const employeeData = {
        username: "andi" + i,
        firstname: "an" + i,
        lastname: "di" + i,
        email: "user" + i + "@gmail.com",
        birthdate: "635779330000",
        basicsalary: 400000000,
        status: "active",
        group: "it",
        description: "635779330000"
      };
      this.employeeService.register(employeeData)
        .pipe(first())
        .subscribe(
          data => {
          },
          error => {
            this.alertService.error(error);
          });
    }
    this.refresh();
  }


  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}