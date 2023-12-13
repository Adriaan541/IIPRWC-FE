import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth.service";
import { User } from "../../models/user.model";
import { AccountService } from "../account.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit{
  public openedTab: string = '';
  public isAdmin = this.authService.isAdmin();
  public myUserProfile: User = {} as User;
  public form: FormGroup;

  public error: string = '';
  public warning: string = '';

  constructor(private authService: AuthService,
              private accountService: AccountService,
              private formBuilder: FormBuilder,
              private router: Router) {
    this.form = this.formBuilder.group({
      email: [{value: ''}],
      firstName: [''],
      preposition : [""],
      lastName : [""]
    })
  }

  ngOnInit() {
    this.getAccount();
  }

  getAccount() {
    this.accountService.getUser().subscribe({
      next: (user) => {
        this.myUserProfile = user;
        this.form.patchValue(user);
      },
      error: e => {this.error = e;}
    })
  }

  submit() {
    let val = this.form.value;
    this.accountService.updateUser(this.myUserProfile.id, val.email, val.firstName, val.preposition, val.lastName).subscribe({
      next: user => { this.getAccount();},
      error: e => {this.error = e.message;}
    })
  }

  logOut() {
    this.authService.logOut();
    this.router.navigateByUrl('auth/login');
  }

  deleteAccountClicked() {
    this.warning = 'deleteAccountWarning';
  }

  deleteAccountCancelled() {
    this.warning = '';
  }

  deleteAccountConfirmed() {
    this.accountService.deleteUser().subscribe({
      next: user => {this.router.navigateByUrl('/home');},
      error: e => {this.error = e;}
    })
  }

  toggleOrders() {
    switch (this.openedTab) {
      case '': this.openedTab = 'orders'; break;
      case 'info': this.openedTab = 'orders'; break;
      case 'orders': this.openedTab = ''; break;
    }
  }

  toggleInfo() {
    switch (this.openedTab) {
      case '': this.openedTab = 'info'; break;
      case 'orders': this.openedTab = 'info'; break;
      case 'info': this.openedTab = ''; break;
    }
  }
}
