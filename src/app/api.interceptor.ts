import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpClient, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { SERVER_URL } from '../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor{

    constructor(public http: HttpClient, private storage: Storage) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        if(req.headers.get('authExempt') === 'true'){
            return next.handle(req);
        }
        
        return from(this.storage.get('tokens'))
            .pipe(
                switchMap(token => {
                    token = JSON.parse(token);
                    if(token.token){
                        req = req.clone({headers: req.headers.set('Authorization', `Bearer ${token.token}`)});
                    }

                    return next.handle(req).pipe(
                        catchError((err) => {
                            if(err.error.message == 'Expired JWT Token'){
                                return this.handleRefreshToken(req, next, token);
                            }
                        })
                    )
                })
            )
    }

    handleRefreshToken(req: HttpRequest<any>, next: HttpHandler, token){
        return this.http.get<any>(`${SERVER_URL}/token/refresh?refresh_token=${token.refresh_token}`).pipe(
            switchMap(
                (data) => {
                    this.storage.set('tokens', JSON.stringify(data));
                    req = req.clone({headers: req.headers.set('Authorization', `Bearer ${data.token}`)});
                    return next.handle(req)
                }
            )
            
        )
    }
}