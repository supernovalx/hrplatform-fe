import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public loginForm=this.fb.group(
    {
      email:['',Validators.required],
      password:['',Validators.required]
      
    }
  );
  constructor(public authService: AuthService,public fb:FormBuilder) {}

  ngOnInit() {}

  onSubmit()
  {
    this.authService.SignIn(this.loginForm.value);
  }
}
