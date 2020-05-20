import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DbService } from 'src/app/shared/services/db.service';
import { Company } from 'src/app/shared/services/company';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conpany',
  templateUrl: './conpany.component.html',
  styleUrls: ['./conpany.component.css']
})
export class ConpanyComponent implements OnDestroy {
  user:any;
  company:Company;
  account_validation_messages = {
    'name': [
      { type: 'required', message: 'Company name is required' }
    ],
    'description': [
      { type: 'required', message: 'Company description is required' }
    ]
    }

  public companyForm = this.fb.group({
    id:[''],
    name: ['',Validators.required],
    description: ['',Validators.required]
  });
  userSub:Subscription
  constructor(private fb:FormBuilder,public auth:AuthService,public db:DbService) { 
    this.userSub=auth.user$.subscribe(user=>
      {
        this.user=user;
        db.getCompany(user.uid).subscribe(c=>{
          this.company=c;
          this.companyForm.setValue({
            id:c.id,
            name:c.name,
            description:c.description
          });
        });
      });
      
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  onSubmit(){
    this.db.setCompanyData(this.companyForm.value).then(()=>alert('Update succeed'));
  }
  ngOnInit(): void {
  }

}
