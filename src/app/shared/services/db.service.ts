import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Company } from './company';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(public afs: AngularFirestore,public afAuth: AngularFireAuth) {
    
   }

   getCompany(id:string)
   {
    return this.afs.doc<Company>(`companies/${id}`).valueChanges();
   }

   setCompanyData(company:Company)
   {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `companies/${company.id}`
    );
    return userRef.set(company, {
      merge: true
    });
   }


}
