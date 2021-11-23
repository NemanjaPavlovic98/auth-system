import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { EditUserComponent } from './auth/edit-user/edit-user.component';
import { IsLoggedInGuardGuard } from './auth/is-logged-in-guard.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListNotesComponent } from './notes/list-notes/list-notes.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  // { path: 'create', component: CreatePostComponent, canActivate: [AuthGuard] },
  // {
  //   path: 'edit/:id',
  //   component: CreatePostComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [IsLoggedInGuardGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [IsLoggedInGuardGuard],
  },
  {
    path: 'user/edit/:id',
    component: EditUserComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, IsLoggedInGuardGuard],
})
export class AppRoutingModule {}
