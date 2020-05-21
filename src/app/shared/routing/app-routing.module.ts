import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from 'src/app/components/sign-in/sign-in.component';
import { SignUpComponent } from 'src/app/components/sign-up/sign-up.component';
import { AuthGuard } from '../guard/auth.guard';
import { ManageDepartmentComponent } from 'src/app/components/manage-department/manage-department.component';
import { MyProfileComponent } from 'src/app/components/my-profile/my-profile.component';
import { ConpanyComponent } from 'src/app/components/conpany/conpany.component';
import { ManageUserComponent } from 'src/app/components/manage-user/manage-user.component';
import { LoggedInGuard } from '../guard/logged-in.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SignInComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'manage-departments', component: ManageDepartmentComponent, canActivate:[AuthGuard] },
  { path: 'profile', component: MyProfileComponent , canActivate:[AuthGuard]},
  { path: 'company', component: ConpanyComponent, canActivate:[AuthGuard]},
  { path: 'manage-users', component: ManageUserComponent, canActivate:[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
