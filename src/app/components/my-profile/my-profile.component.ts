import { DbService } from 'src/app/shared/services/db.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'firebase';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnDestroy {
  user: any;
  account_validation_messages = {
    fullname: [{ type: 'required', message: 'Fullname is required' }],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      {
        type: 'minlength',
        message: 'Password must be at least 6 characters long'
      }
    ],
    address: [{ type: 'required', message: 'Address is required' }],
    phone: [{ type: 'required', message: 'Phone is required' }],
    dob: [{ type: 'required', message: 'Date of birth is required' }]
  };

  public profileForm = this.fb.group({
    uid: [''],
    fullname: ['', Validators.required],
    address: ['', Validators.required],
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])
    ],
    phone: ['', Validators.required],
    dob: ['', Validators.required]
  });
  userSub:Subscription;
  constructor(
    public auth: AuthService,
    public fb: FormBuilder,
    public db: DbService
  ) {
    this.userSub=auth.user$.subscribe(user => {
      this.user = user;
      this.profileForm.setValue({
        uid: user.uid,
        fullname: user.fullname,
        address: user.address,
        email: user.email,
        phone: user.phone,
        dob: user.dob
      });
    });
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  onSubmit() {
    this.db
      .setUserData(this.profileForm.value)
      .then(() => alert('Update succeed'));
  }
  ngOnInit(): void {}
}
