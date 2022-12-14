import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";

const TOKEN_KEY = "AUTH_TOKEN";

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private issuer = {
    login: environment.BACKEND_API_URL+'auth/login',
    register: environment.BACKEND_API_URL+'auth/register',
  };

  constructor() {}

  handleData(token: any) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Verify the token
  isValidToken() {
    const token = this.getToken();
    if (token) {
      const payload = this.payload(token);
      if (payload) {
        return Object.values(this.issuer).indexOf(payload.iss) > -1;
      }
      else{
        return false;
      }
    } else {
      return false;
    }
  }


  payload(token: any) {
    const jwtPayload = token.split('.')[1];
    return JSON.parse(atob(jwtPayload));
  }

  // User state based on valid token
  isLoggedIn() {
    return this.isValidToken();
  }

  // Remove token
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }
}
