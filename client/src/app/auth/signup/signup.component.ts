import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { mimeType } from '../../common/mime-type.validator';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  public showPassword = false;
  @ViewChild('filePicker') filePicker;
  isLoading = false;
  form: FormGroup;
  error: string[] = [];
  private authStatusSub = new Subscription();
  imagePreview: string =
    'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // this.authStatusSub = this.authService
    //   .getAuthStatusListener()
    //   .subscribe(() => {
    //     this.isLoading = false;
    //   });
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      username: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { asyncValidators: [mimeType] }),
    });
  }

  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    //isto kao setValue, samo sto ovo pogadja single controll
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  public toggleShowPassword() {
		this.showPassword = !this.showPassword;
	}

  onSignup() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService
      .createUser(
        this.form.value.name,
        this.form.value.username,
        this.form.value.email,
        this.form.value.password,
        this.form.value.image
      )
      .subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          let errorMessage = ['An unknown message occured!'];
          if (error.error.message) {
            errorMessage = [];
            errorMessage.push(error.error.message);
            this.error = [...errorMessage];
          }
          if (error.error.message) {
            errorMessage = error.error.message;
            this.error = errorMessage;
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
