import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'firebase';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  user:any;
  constructor(public auth:AuthService) { 
    auth.user$.subscribe(user=>this.user=user);
  }

  ngOnInit(): void {
  }

}
