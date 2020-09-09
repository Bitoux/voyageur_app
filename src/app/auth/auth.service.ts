import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tap, catchError } from 'rxjs/operators';
import { Observable, BehaviorSubject, throwError } from 'rxjs';

import { Storage } from "@ionic/storage";
import { User } from "./user";
import { AuthResponse } from "./auth-response";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AUTH_SERVER_ADDRESS:  string  =  'https://127.0.0.1:8000/api';
  authSubject  =  new  BehaviorSubject(false);

  constructor(private httpClient: HttpClient, private storage: Storage) {

  }

  register(user: User): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/register`, user).pipe(
      tap(async (res: AuthResponse) => {
        if(res.user){
          await this.storage.set('user', JSON.stringify(user));
          this.authSubject.next(true);
        }
      })
    );
  }

  login(user: User): Observable<any> {
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    return this.httpClient.post<any>(`${this.AUTH_SERVER_ADDRESS}/login_check`, {
      username: user.email,
      password: user.password
    }, {headers: headers}).pipe(
      tap(async (res) => {
        if(res.token){
          await this.storage.set('user', JSON.stringify({
            email: user.email
          }));
          await this.storage.set('token', res.token);
          await this.storage.set('refresh_token', res.refresh_token);
          this.authSubject.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  async logout() {
    await this.storage.remove('user');
    await this.storage.remove('token');
    await this.storage.remove('refresh_token');
    this.authSubject.next(false);
  }

  handleError(error){
    if(error.error.message){
      return [error];
    }else{
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      return throwError(errorMessage);
    }
  }
}
