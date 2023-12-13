import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import * as moment from "moment";
import { Buffer } from "buffer";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  public signUp(firstName: string, preposition: string, lastName: string, email: string, password: string) {
    return this.http.post<HttpResponse<any>>(
      '/api/auth/signup',
      { email: email, password, firstName, preposition, lastName }
    );
  }

  public logIn(email: string, password: string) {
    return this.http.post<{ accessToken: string, expiresAt: string, userId: string }>(
      '/api/auth/login',
      { email: email, password }
    );
  }

  public logOut() {
    this.destroySession();
  }

  private tokenExpiration(token: string) {
    const expiry = (JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('binary'))).exp;
    return expiry;
  }

  public setSession(authResult: any) {
    localStorage.setItem('id_token', authResult.accessToken);
    localStorage.setItem("expires_at", this.tokenExpiration(authResult.accessToken));
    localStorage.setItem("userId", authResult.userId);
    localStorage.setItem("admin", authResult.admin);
  }

  public destroySession() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("userId");
    localStorage.removeItem("admin");
  }

  public isLoggedIn() {
    let isLoggedIn = moment().isBefore(this.getExpiration(), "milliseconds");
    if (!isLoggedIn) {
      this.destroySession();
    }
    return isLoggedIn;
  }

  public isAdmin() {
    return localStorage.getItem("admin") === "true";
  }

  public getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    return moment.unix(parseInt(expiration as string));
  }
}
