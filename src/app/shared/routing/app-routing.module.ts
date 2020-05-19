import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from 'src/app/components/sign-in/sign-in.component';
import { SignUpComponent } from 'src/app/components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from 'src/app/components/forgot-password/forgot-password.component';
import { AuthGuard } from '../guard/auth.guard';
import { VerifyEmailComponent } from 'src/app/components/verify-email/verify-email.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { ManageDepartmentComponent } from 'src/app/components/manage-department/manage-department.component';
import { HomeComponent } from 'src/app/components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SignInComponent },
  { path: 'register', component: SignUpComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'manage-department', component: ManageDepartmentComponent },
  { path: 'home', component: HomeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
