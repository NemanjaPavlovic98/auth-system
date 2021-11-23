import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mimeType } from 'src/app/common/mime-type.validator';
import { ToastService } from 'src/app/common/toast.service';
import { AuthService } from '../auth.service';
import { UserResponse } from '../user.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  user: UserResponse;
  file;
  userId;
  showPassword = false;
  changePassword = false;
  @ViewChild('filePicker') filePicker;
  isLoading = false;
  form: FormGroup;
  error: string[] = [];
  private authStatusSub = new Subscription();
  imagePreview: string =
    'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

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
      password: new FormArray([]),
      // password: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { asyncValidators: [mimeType] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.userId = +paramMap.get('id');
        this.isLoading = true;
        this.authService.getUserById(this.userId).subscribe(
          (returnedUser: UserResponse) => {
            this.isLoading = false;
            this.user = {
              id: returnedUser.id,
              name: returnedUser.name,
              username: returnedUser.username,
              email: returnedUser.email,
              imageUrl: returnedUser.imageUrl,
            };
            this.form.setValue({
              name: this.user.name,
              username: this.user.username,
              email: this.user.email,
              password: [],
              image: this.user.imageUrl ? this.user.imageUrl : null,
            });
            this.imagePreview = this.user.imageUrl
              ? this.user.imageUrl
              : this.imagePreview;
          },
          (err) => {
            this.isLoading = false;
            alert(err);
            this.router.navigate(['/']);
          }
        );
      } else {
      }
    });
  }

  onImageChange(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
    //isto kao setValue, samo sto ovo pogadja single controll
    this.form.patchValue({ image: this.file });
    this.form.get('image').updateValueAndValidity;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }

  public toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onUpdate() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    let newPassword;
    if (this.form.value.password.length > 0) {
      newPassword =
        this.form.value.password[this.form.value.password.length - 1];
    }
    console.log(this.form.value);
    this.authService
      .updateUser(
        this.userId,
        this.form.value.name,
        this.form.value.username,
        this.form.value.email,
        // this.form.value.password,
        newPassword ? newPassword : null,
        this.form.value.image ? this.form.value.image : null
      )
      .subscribe(
        (res) => {
          this.authService.user.next(res.user);
          this.toastService.fireToast('success', 'User updated!');
          this.router.navigate(['/']);
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
          console.log(this.error);
        }
      );
  }

  passwords() {
    return (<FormArray>this.form.get('password')).controls;
  }

  onChangePassword() {
    this.changePassword = !this.changePassword;
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.form.get('password')).push(control);
  }

  onDiscardChangePassword(index) {
    this.changePassword = false;
    (<FormArray>this.form.get('password')).removeAt(index);
  }

  onImageRemove() {
    this.form.get('image').setValue(null);
    this.imagePreview =
      'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
