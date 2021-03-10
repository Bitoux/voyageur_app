import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tap, catchError } from 'rxjs/operators';
import { Observable, BehaviorSubject, throwError } from 'rxjs';

import { Storage } from "@ionic/storage";
import { User } from "./user";
import { AuthResponse } from "./auth-response";
import { SERVER_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AUTH_SERVER_ADDRESS:  string  =  SERVER_URL;
  authSubject  =  new  BehaviorSubject(false);

  constructor(private httpClient: HttpClient, private storage: Storage) {

  }

  register(user: User): Observable<AuthResponse> {
    let headers = new HttpHeaders()
      .set("Accept", 'application/json')
      .set('Content-Type', 'application/json' )
      .set('authExempt', 'true')
    ;
    return this.httpClient.post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/register`, user, {headers: headers}).pipe(
      tap(async (res: AuthResponse) => {
        if(res.user){
          await this.storage.set('user', JSON.stringify(user));
          this.authSubject.next(true);
        }
      })
    );
  }

  forgetPassword(email): Observable<any> {
    var headers = new HttpHeaders()
      .set("Accept", 'application/json')
      .set('Content-Type', 'application/json' )
      .set('authExempt', 'true')
    ;
    return this.httpClient.post<any>(`${this.AUTH_SERVER_ADDRESS}/forgoten_password`, {
      email: email
    }, {headers: headers}).pipe(
      tap(async (res) => {
        console.log('res', res);
      })
    )
  }

  login(user: User): Observable<any> {
    var headers = new HttpHeaders()
      .set("Accept", 'application/json')
      .set('Content-Type', 'application/json' )
      .set('authExempt', 'true')
    ;
    
    return this.httpClient.post<any>(`${this.AUTH_SERVER_ADDRESS}/login_check`, {
      username: user.email,
      password: user.password
    }, {headers: headers}).pipe(
      tap(async (res) => {
        if(res.token){
          await this.storage.set('user', JSON.stringify({
            email: user.email
          }));
          await this.storage.set('tokens', JSON.stringify(res));
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
