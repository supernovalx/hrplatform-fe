import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'firebase';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  user:any;
  account_validation_messages = {
    'fullname': [
      { type: 'required', message: 'Fullname is required' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 6 characters long' }
    ],
    'address': [
      { type: 'required', message: 'Address is required' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required' }
    ],
    'dob': [
      { type: 'required', message: 'Date of birth is required' }
    ],
    }

  public profileForm = this.fb.group({
    uid:[''],
    fullname: ['',Validators.required],
    address: ['',Validators.required],
    email:['',Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])],
    phone:['',Validators.required],
    dob:['',Validators.required]
  });
  constructor(public auth:AuthService,public fb:FormBuilder) { 
    auth.user$.subscribe(user=>
      {
        this.user=user;
        this.profileForm.setValue(
          {
            uid:user.uid,
            fullname:user.displayName,
            address:user.address,
            email:user.email,
            phone:user.phone,
            dob:user.dob
          }
        );
      });
  }
  onSubmit(){
    this.auth.SetUserData(this.auth.userData,this.profileForm.value).then(()=>alert('Update succeed'));
  }
  ngOnInit(): void {
  }

}
