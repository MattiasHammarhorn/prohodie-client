import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLoginModel } from '../models/userLoginModel';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  endPoint: string = "https://localhost:7173/api/auth"
  constructor(private http: HttpClient) {}

  loginUser(userLoginModel: UserLoginModel) {
    return this.http.post<UserLoginModel>(this.endPoint + "/signin", userLoginModel, {headers: new HttpHeaders({"Content-Type":"application/json"})});
  }
}
