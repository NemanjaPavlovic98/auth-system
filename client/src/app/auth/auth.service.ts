import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  AuthenticationResponse,
  User,
  UserCredentials,
  UserResponse,
} from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<UserResponse>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  getUserById(id: number) {
    return this.http.get<UserResponse>(
      'http://localhost:3000/api/users/get/id/' + id
    );
  }

  createUser(
    name: string,
    username: string,
    email: string,
    password: string,
    image?: File
  ) {
    const userData = new FormData();
    userData.append('name', name);
    userData.append('username', username);
    userData.append('email', email);
    userData.append('password', password);
    if (image) {
      userData.append('image', image, username);
    }
    return this.http.post('http://localhost:3000/api/users/register', userData);
  }

  updateUser(
    id: string,
    name: string,
    username: string,
    email: string,
    password: string | null,
    image: File | string
  ) {
    const userData = new FormData();
    userData.append('id', id);
    userData.append('name', name);
    userData.append('username', username);
    userData.append('email', email);
    if (password) {
      userData.append('password', password);
    }
    if (typeof image === 'object' && image !== null) {
      userData.append('image', image, username);
    }
    if (typeof image === 'string' && image !== null) {
      userData.append('image', image);
    }
    return this.http.put<{ message: string; user: UserResponse }>(
      'http://localhost:3000/api/users/updateUser',
      userData
    );
  }

  login(email: string, password: string) {
    const userCredentials: UserCredentials = {
      email: email,
      password: password,
    };
    return this.http
      .post<AuthenticationResponse>(
        'http://localhost:3000/api/users/login',
        userCredentials
      )
      .pipe(
        // catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.token,
            resData.user,
            resData.expirationTime
          );
        })
      );
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expiration.getTime() - now.getTime();

    // alert(expiresIn);
    if (expiresIn <= 0) {
      this.autoLogout(expiresIn);
    } else {
      this.getUserById(authInfo.userData.id).subscribe((res) => {
        this.user.next(res);
      });
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    this.clearAuthData();

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    token: string,
    userData: UserResponse,
    expirationTime: number
  ) {
    const expirationDate = new Date(
      new Date().getTime() + expirationTime * 1000
    );
    this.user.next(userData);
    this.saveAuthData(token, userData, expirationDate);
    this.autoLogout(expirationTime * 1000);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }

  getAuthData() {
    const token: string = localStorage.getItem('token');
    const userData: UserResponse = JSON.parse(localStorage.getItem('userData'));
    const expiration = localStorage.getItem('expiration');

    if (!token || !expiration) {
      return null;
    }

    return {
      token: token,
      userData: userData,
      expiration: new Date(expiration),
    };
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    const expirationTime = +localStorage.getItem('expiration');
    const expirationDate = new Date(
      new Date().getTime() + expirationTime * 1000
    );

    if (expirationDate <= new Date()) {
      this.logout();
      return false;
    }

    return true;
  }

  private saveAuthData(
    token: string,
    userData: UserResponse,
    expirationDate: Date
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem(
      'userData',
      JSON.stringify({ id: userData.id, username: userData.username })
    );
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('expiration');
  }
}
