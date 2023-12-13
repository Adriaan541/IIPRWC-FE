import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
  public hidePassword = true;
  public form: FormGroup;
  public isLoading = false;
  public invalidAuth = false;
  public error = null;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {
    this.form = this.formBuilder.group({
      enteredEmail: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      enteredPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/');
    }
  }

  submitForm() {
    const value = this.form.value;

    if (value.enteredEmail && value.enteredPassword) {
      this.isLoading = true;
      this.authService.logIn(value.enteredEmail, value.enteredPassword).subscribe({
        next: data => {
          this.authService.setSession(data);
          this.router.navigateByUrl('/');
        },
        error: error => {
          this.isLoading = false;
          this.invalidAuth = true;
          this.error = error.message;
        }
      })
    }
  }

  toggleShowPassword() {
    this.hidePassword = !this.hidePassword;
  }
}
