import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
  });

  constructor() {}

  fireToast(icon, title1: string) {
    this.Toast.fire({
      icon: icon,
      title: title1,
    });
  }
}
