import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DbService } from 'src/app/shared/services/db.service';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnDestroy {
  company:any;
  userSub:Subscription;
  departmentsSub:Subscription;
  usersSub:Subscription;
  loading=true;
  departmentsData:any;
  usersData:any;
  userData:any;
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
    'department': [
      { type: 'required', message: 'Department is required' }
    ],
    }

  public userForm = this.fb.group({
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
    dob:['',Validators.required],
    department:['',Validators.required]

  });
  selectedFilter='0';
  constructor(public auth:AuthService,public db:DbService,private fb:FormBuilder) { 
    this.userSub=this.auth.user$.subscribe(u=>{
      this.loading=true;
      this.userData=u;
      if(u?.companyId)
      db.getCompany(u.companyId).subscribe(c=>{
        this.company=c;
      })

      this.departmentsSub?.unsubscribe();
      this.departmentsSub=this.db
        .getDepartmentsCollectionByCompanyId(u.companyId)
        .subscribe(d => 
          {
            console.log('new data');
            this.departmentsData = d;
            this.loading=false;
          });
          
      this.userSub?.unsubscribe();
      this.userSub=this.db
        .getUsersByCompanyId(u.companyId)
        .subscribe(d => 
          {
            console.log('new data');
            this.usersData = d;
            
          });
    });
    
  }
  updateUser(){

  }
  addUser(){
    this.auth.addNewAccount({...this.userForm.value,companyId:this.company.id,departmentId:this.userForm.value.department});
  }

  filter(l) {
    return l.filter(i=>i.email!==this.userData.email  && (i.department===this.selectedFilter || this.selectedFilter==='0'));
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  getDepartmentName(id:string)
  {
    this.departmentsData?.forEach(d => {
        if(d.id===id)
        return d.name;
    });
  }
  ngOnInit(): void {
  }

}
