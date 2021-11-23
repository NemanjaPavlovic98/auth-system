import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.authService.getAuthData()) {
      const authRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this.authService.getAuthData().token),
      });
      return next.handle(authRequest);
    }
    return next.handle(req);
  }
}
