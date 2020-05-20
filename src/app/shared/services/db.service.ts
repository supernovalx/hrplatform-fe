import { Department } from './department';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Company } from './company';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './user';
@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth) {}

  getCompany(id: string) {
    return this.afs.doc<Company>(`companies/${id}`).valueChanges();
  }

  setCompanyData(company: Company) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `companies/${company.id}`
    );
    return userRef.set(company, {
      merge: true
    });
  }

  setUserData(user: User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    return userRef.set(user, {
      merge: true
    });
  }

  getDepartmentsCollectionByCompanyId(companyId: string) {
    return this.afs
      .collection('departments', ref => ref.where('companyId', '==', companyId))
      .valueChanges({ idField: 'id' });
  }

  addDepartment(deparment: Department) {
    return this.afs.collection('departments').add(deparment);
  }

  setDepartmentData(deparment:Department)
  {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `departments/${deparment.id}`
    );
    return userRef.set(deparment, {
      merge: true
    });
  }
  deleteDepartment(id:string)
  {
    this.deleteChildDepartment(id);
    return this.afs.doc(`departments/${id}`).delete();
  }

  deleteChildDepartment(parentId:string)
  {
    this.afs
      .collection('departments', ref => ref.where('parentId', '==', parentId))
      .valueChanges({ idField: 'id' }).subscribe(dl=>{
        dl.forEach(d=>{
          this.afs.doc(`departments/${d.id}`).delete();
          this.deleteChildDepartment(d.id)}
          );
      })
  }

  getUsersByCompanyId(id:string)
  {
    return this.afs
      .collection('users', ref => ref.where('companyId', '==', id))
      .valueChanges({ idField: 'id' });
  }

  getUsersByCompanyIdAndDepartmentId(companyId:string,departmentId:string)
  {
    return this.afs
      .collection('users', ref => ref.where('companyId', '==', companyId).where('departmentId','==',departmentId))
      .valueChanges({ idField: 'id' });
  }

}
