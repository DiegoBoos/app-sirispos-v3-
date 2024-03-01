import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { ErrorMagement } from '../shared/helpers/error-management.helper';


@Injectable({ providedIn: 'root' })
export class InterceptorService implements HttpInterceptor {

    private authService = inject(AuthService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = localStorage.getItem('token-app-spv3') || '';
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        const reqClone = req.clone({
            headers
        });

        return next.handle(reqClone).pipe(
            tap({
                error: (error: HttpErrorResponse) => {    
                    if (error.status === 401) {
                        this.logout();
                    }
                }
            }),
            catchError(this.manegeError)
        );
    }


    manegeError(err: HttpErrorResponse) {
        console.warn(err);
        ErrorMagement(err);
        return throwError(() => err);
    }

    logout() {
        this.authService.logout()
    }

}
