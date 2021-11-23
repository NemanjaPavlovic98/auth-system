import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-authorized-view',
  templateUrl: './authorized-view.component.html',
  styleUrls: ['./authorized-view.component.scss'],
})
export class AuthorizedViewComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  @Input()
  role: string;

  public isAuthorized() {
    // if (this.role){
    //   return this.authService.getRole() === this.role;
    // } else{
    return this.authService.isAuthenticated();
    // }
  }
}
