import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  public hidePassword = true;
  public form: FormGroup;
  public isLoading = false;
  public invalidAuth = false;
  public error = null;


  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {
    this.form = this.formBuilder.group({
      enteredFirstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(64)]],
      enteredPreposition: [''],
      enteredLastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(64)]],
      enteredEmail: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      enteredPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      enteredRepeatPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/')
    }
  }

  submitForm() {
    const value = this.form.value;

    if (value.enteredFirstName && value.enteredLastName && value.enteredEmail && value.enteredPassword === value.enteredRepeatPassword) {
      this.isLoading = true;
      this.authService.signUp(value.enteredFirstName, value.enteredPreposition, value.enteredLastName, value.enteredEmail, value.enteredPassword).subscribe({
        next: data => {
          this.router.navigateByUrl('/auth/login');
        },
        error: error => {
          this.isLoading = false;
          this.invalidAuth = true;
        }
      })
    }
  }

  toggleShowPassword() {
    this.hidePassword = !this.hidePassword;
  }
}
