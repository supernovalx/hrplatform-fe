import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from './user';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; // Save logged in user data
  user$: Observable<User>;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public db: DbService
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    /*this.afAuth.authState.subscribe(user => {
      console.log('subscribe', user);
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });*/

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
    this.user$.subscribe(u => {
      this.userData = u;
    });
  }

  // Sign in with email/password
  SignIn(user: User) {
    console.log('signin');
    return this.afAuth
      .signInWithEmailAndPassword(user.email, user.password)
      .then(result => {
        console.log(result);
        this.ngZone.run(() => {
          this.router.navigate(['manage-departments']);
          console.log('navigate dashboard');
        });
        //this.SetUserData(result.user,user);
      })
      .catch(error => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(user: User) {
    console.log(user);
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(result => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        //this.SendVerificationMail();
        this.ngZone.run(() => {
          this.router.navigate(['manage-departments']);
          console.log('navigate dashboard');
        });
        console.log('result', result.user);
        //this.SetUserData(result.user, user);
        this.db.setUserData({
          ...user,
          uid: result.user.uid,
          companyId: result.user.uid
        });
        this.db.setCompanyData({
          id: result.user.uid,
          name: result.user.email,
          description: result.user.email
        });
      })
      .catch(error => {
        window.alert(error.message);
      });
  }

  addNewAccount(user: User) {
    return this.db.setUserData({ ...user, uid: this.afs.createId() });
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(result => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        //this.SendVerificationMail();
        console.log('result', result.user);
        //this.SetUserData(result.user, user);
      })
      .catch(error => {
        window.alert(error.message);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    //const user = JSON.parse(localStorage.getItem('user'));
    return this.userData !== null ? true : false;
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service
  SetUserData(user,userInfo) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: userInfo.fullname,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      address: userInfo.address,
      phone: userInfo.phone,
      dob: userInfo.dob,
      companyId:user.uid
    };
    return userRef.set(userData, {
      merge: true
    });
  }*/

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
