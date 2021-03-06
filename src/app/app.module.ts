import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2GoogleChartsModule, GoogleChartsSettings } from 'ng2-google-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Firebase services + enviorment module
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AppRoutingModule } from 'src/app/shared/routing/app-routing.module';
import { AuthService } from './shared/services/auth.service';
import { ManageDepartmentComponent } from './components/manage-department/manage-department.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { ConpanyComponent } from './components/conpany/conpany.component';
import { DbService } from './shared/services/db.service';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { DepartmentNamePipe } from './shared/pipes/department-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ManageDepartmentComponent,
    MyProfileComponent,
    ConpanyComponent,
    ManageUserComponent,
    DepartmentNamePipe
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    Ng2GoogleChartsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [AuthService,DbService],
  bootstrap: [AppComponent]
})
export class AppModule {}
