import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserResponse } from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;
  toggleDropdown = false;
  user: UserResponse;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      if(user){
        this.user = user;
      }
    });
    
  }

  onToggleDrowdown(){
    this.toggleDropdown = !this.toggleDropdown;
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
