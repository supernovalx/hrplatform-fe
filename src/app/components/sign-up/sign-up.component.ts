import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { auth } from 'firebase';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
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

  public registerForm = this.fb.group({
    fullname: ['',Validators.required],
    address: ['',Validators.required],
    email:['',Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])],
    password:['',Validators.compose([
      Validators.required,
      Validators.minLength(6)
    ])],
    phone:['',Validators.required],
    dob:['',Validators.required]
  });
  constructor(public authService: AuthService,public fb:FormBuilder) {

  }

  onSubmit()
  {
    this.authService.SignUp(this.registerForm.value);
  }
  ngOnInit(): void {}
}
