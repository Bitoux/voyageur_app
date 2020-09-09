import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { async } from '@angular/core/testing';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  AUTH_SERVER_ADDRESS:  string  =  'https://127.0.0.1:8000/api';

  constructor(private httpClient: HttpClient, private storage: Storage) {
    
  }
  
  get(url: string, token: string, param): Observable<any> {
    var header = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.httpClient
      .get<any>(`${this.AUTH_SERVER_ADDRESS}/${url}`, {headers: header})
      .pipe(
        tap(async (res) => {
          return res;
        }),
        catchError(this.handleError)
      );
    // return this.sendRequest(`${this.AUTH_SERVER_ADDRESS}/${url}`, 'get', null, header).pipe(
    //   map(res => res.json()),
    //   catchError(this.handleError)
    // ).toPromise();
  }

  refreshToken(refresh_token): Observable<any> {
    return this.httpClient
      .get<any>(`${this.AUTH_SERVER_ADDRESS}/token/refresh?refresh_token=${refresh_token}`).pipe(
        tap(async data => {
          this.saveToken(data.token, data.refresh_token);
        })
      );
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

  async saveToken(token, refresh_token){
    await this.storage.set('token', token);
    await this.storage.set('refresh_token', refresh_token);
  }

  // sendRequest(url, type, params = null, headers): Observable<any> {
  //   return this.httpClient.get(url, {headers: headers})
  // }
}
