import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl: string = "/api/user";

  constructor(private http: HttpClient) {}

  getUser() {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe();
  }

  updateUser(id: string, email: string, firstName:string, preposition:string, lastName:string) {
    return this.http.patch<HttpResponse<any>>(`${this.apiUrl}/${id}`, {id, email, firstName, preposition, lastName}).pipe();
  }

  deleteUser() {
    return this.http.delete(`${this.apiUrl}/deleteMe`).pipe();
  }
}
