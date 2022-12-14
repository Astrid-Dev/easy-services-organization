import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenService} from "./token.service";
import {AuthStateService} from "./auth-state.service";
import {User} from "../models/User";
import {environment} from "../../environments/environment";

const AUTH_URL = environment.BACKEND_API_URL + "auth/";
const REGISTER_URL = AUTH_URL + "register";
const LOGIN_URL = AUTH_URL + "login";
const LOGOUT_URL = AUTH_URL + "logout";
const USER_PROFILE_URL = AUTH_URL + "user_profile";
const UPDATE_PROFILE_URL = AUTH_URL + "update_profile";
const UPDATE_PASSWORD_URL = AUTH_URL + "update_password";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private authStateService: AuthStateService,
  ) { }

  register(userData: User)
  {
    return new Promise((resolve, reject) => {
      this.http.post(REGISTER_URL, userData)
        .subscribe(
          (res) =>{
            resolve(res);
          },
          (err) =>{
            reject(err);
          }
        )
    });
  }

  login(userData: any)
  {
    return new Promise((resolve, reject) => {
      this.http.post(LOGIN_URL, userData)
        .subscribe(
          (res: any) =>{
            this.authStateService.setUserData(res.user);
            this.tokenService.handleData(res.access_token);
            resolve(res);
          },
          (err) =>{
            reject(err);
          }
        )
    });
  }

  logout()
  {
    return new Promise((resolve, reject) => {
      this.http.post(LOGOUT_URL, null)
        .subscribe(
          res =>{
            this.performLogOut();
            resolve(res);
          },
          err =>{
            reject(err);
          }
        )
    });
  }

  performLogOut()
  {
    this.authStateService.  setAuthState(false);
    this.tokenService.removeToken();
  }

  updateUserProfile(userId: number, newUserData: FormData)
  {
    return new Promise(((resolve, reject) => {
      this.http.put(UPDATE_PROFILE_URL+"/"+userId, newUserData)
        .subscribe(
          res =>{
            resolve(res);
          },
          err =>{
            reject(err);
          }
        )
    }))
  }

  updatePassword(userId: number, passwordData: {old_password: string, new_password: string, new_password_confirmation: string})
  {
    return new Promise((resolve, reject) => {
      this.http.put(UPDATE_PASSWORD_URL+'/'+userId, passwordData)
        .subscribe(
          (res) =>{
            resolve(res);
          },
          (err) =>{
            reject(err);
          }
        )
    });
  }
}
