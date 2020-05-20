import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { DbService } from './shared/services/db.service';
import { Company } from './shared/services/company';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  company:Company;
  constructor(public router: Router,public auth:AuthService,public db:DbService){
    auth.user$.subscribe(u=>{
      if(u?.companyId)
      db.getCompany(u.companyId).subscribe(c=>{
        this.company=c;
      })
    })
  }

}