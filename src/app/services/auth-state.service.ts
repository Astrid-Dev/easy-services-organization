import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TokenService } from './token.service';
import {User} from "../models/User";

const USER_DATA_KEY = "USER_DATA";

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {

  private userState = new BehaviorSubject<boolean>(this.token.isLoggedIn()!);
  private $userData = new BehaviorSubject<User | null>(this.initialUserData);

  userAuthState = this.userState.asObservable();
  userData = this.$userData.asObservable();

  constructor(public token: TokenService) {
    this.getUserData();
  }

  setAuthState(value: boolean) {
    this.userState.next(value);
  }

  setUserData(value: User)
  {
    this.$userData.next(value);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(value));
  }

  getUserData()
  {
    return new Promise<User>((resolve, reject) => {
      setTimeout(() =>{
        let user = localStorage.getItem(USER_DATA_KEY);
        if(user){
          this.$userData.next(JSON.parse(user));
          resolve(JSON.parse(user));
        }
        else{
          reject('No user found !');
        }
      });
    });
  }

  get initialUserData(){
    let temp = localStorage.getItem(USER_DATA_KEY);
    return temp ? JSON.parse(temp) : null;
  }
}
