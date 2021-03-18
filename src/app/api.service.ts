import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { map, catchError, tap, take, retryWhen, delay, delayWhen } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { SERVER_URL } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  SERVER_ADDRESS:  string  = SERVER_URL ;
  TOKEN: string;

  constructor(private httpClient: HttpClient, private storage: Storage, private authService: AuthService, private router: Router) {
    
  }
  
  get(url: string): Observable<any> {
    let header = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authExempt': 'false'
    });
    return this.httpClient
      .get<any>(`${this.SERVER_ADDRESS}/${url}`, {headers: header})
      .pipe(
        tap(async (res) => {
          return res;
        })
      );
  }

  /**
   * 
   * @param url 
   * @param token 
   * @param param 
   */
  post(url: string, param): Observable<any> {
    let header = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authExempt': 'false'
    });
    return this.httpClient.post<any>(`${this.SERVER_ADDRESS}/${url}`, param, {headers: header})
      .pipe(
        tap(async (res) => {
          return res;
        })
      );
  }

  put(url: string, param): Observable<any> {
    let header = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authExempt': 'false'
    });
    return this.httpClient.put<any>(`${this.SERVER_ADDRESS}/${url}`, param, {headers: header})
      .pipe(
        tap(async (res) => {
          return res;
        })
      );
  }

  delete(url: string): Observable<any> {
    let header = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authExempt': 'false'
    });
    return this.httpClient.delete<any>(`${this.SERVER_ADDRESS}/${url}`, {headers: header})
      .pipe(
        tap(async (res) => {
          return res;
        })
      )
  }

}
