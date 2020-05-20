export interface User {
  uid: string;
  email: string;
  password?: string;
  displayName: string;
  fullname?: string;
  photoURL: string;
  emailVerified: boolean;
  address?: string;
  phone?: string;
  dob?: Date;
  companyId?: string;
  departmentId?:string;
}
