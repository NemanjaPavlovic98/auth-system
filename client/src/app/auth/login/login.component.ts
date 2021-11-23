import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/common/toast.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  private authStatusSub = new Subscription();
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // this.authStatusSub = this.authService
    //   .getAuthStatusListener()
    //   .subscribe(() => {
    //     this.isLoading = false;
    //   });

    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  onLogin() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService
      .login(this.form.value.email, this.form.value.password)
      .subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['/']);

          this.toastService.fireToast('success', 'Signed in successfully');
        },
        (error: HttpErrorResponse) => {
          let errorMessage = 'An unknown message occured!';
          if (error.error.message) {
            errorMessage = error.error.message;

            this.error = errorMessage;
            this.isLoading = false;
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
