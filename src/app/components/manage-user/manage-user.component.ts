import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DbService } from 'src/app/shared/services/db.service';
import { Validators, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnDestroy {
  company: any;
  userSub: Subscription;
  departmentsSub: Subscription;
  usersSub: Subscription;
  loading = true;
  departmentsData: any;
  usersData: any;
  userData: any;
  selectedUserIdToBeUpdated:any;
  account_validation_messages = {
    fullname: [{ type: 'required', message: 'Fullname is required' }],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' },
      { type: 'existedEmail', message: 'Email has existed!' }
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
    dob: [{ type: 'required', message: 'Date of birth is required' }],
    department: [{ type: 'required', message: 'Department is required' }]
  };

  public userForm = this.fb.group({
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
    dob: ['', Validators.required],
    department: ['', Validators.required]
  });
  selectedFilter = '0';
  constructor(
    public auth: AuthService,
    public db: DbService,
    private fb: FormBuilder
  ) {
    this.userSub = this.auth.user$.subscribe(u => {
      this.loading = true;
      this.userData = u;
      if (u?.companyId)
        db.getCompany(u.companyId).subscribe(c => {
          this.company = c;
        });

      this.departmentsSub?.unsubscribe();
      this.departmentsSub = this.db
        .getDepartmentsCollectionByCompanyId(u.companyId)
        .subscribe(d => {
          console.log('new data');
          this.departmentsData = d;
          this.loading = false;
        });

      this.userSub?.unsubscribe();
      this.userSub = this.db.getUsersByCompanyId(u.companyId).subscribe(d => {
        console.log('new data');
        this.usersData = d;
      });
    });
  }
  selectUser(id:string) {
    let u=this.usersData.find(i=>i.id===id);
    this.userForm.setValue({
      fullname:u.fullname,
      email:u.email,
      dob:u.dob,
      address:u.address,
      department:u.departmentId,
      phone:u.phone
    });
    this.selectedUserIdToBeUpdated=u.id;
  }
  updateUser(){
    this.db.setUserData({...this.userForm.value,uid:this.selectedUserIdToBeUpdated});
  }

  addUser() {
    //console.log('u',this.usersData);
    if(this.usersData.some(u=>u.email===this.userForm.value.email))
    {
      alert('Email has existed!');
      return;
    }
    this.auth.addNewAccount({
      ...this.userForm.value,
      companyId: this.company.id,
      departmentId: this.userForm.value.department
    });
  }

  
  existedEmailValidator(fc: FormControl){
    if(this.usersData && this.usersData.any(u=>u.email===fc.value)){
      return ({existedEmail: true});
    } else {
      return (null);
    }
  }
  deleteUser(id:string)
  {
    console.log(id);
    if(confirm("Are you sure?"))
      this.db.deleteUserById(id);

  }
  filter(l) {
    //console.log(this.selectedFilter, this.selectedFilter === '0');
    /*l.forEach(i => {
      console.log(
        i,
        this.userData.email,
        i.departmentId,
        i.email !== this.userData.email &&
          (i.departmentId === this.selectedFilter ||
            this.selectedFilter === '0')
      );
    });*/
    return l.filter(
      i =>
        i.email !== this.userData.email &&
        (i.departmentId === this.selectedFilter || this.selectedFilter === '0')
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  getDepartmentName(id: string) {
    this.departmentsData?.forEach(d => {
      if (d.id === id) return d.name;
    });
  }
  ngOnInit(): void {}
}
