import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '@core/services/notification.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private notification: NotificationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        let mensaje = 'Ocurrió un error inesperado';

        if (error.error) {

          // Caso backend con estructura de negocio
          if (typeof error.error === 'object' && error.error.mensaje) {
            mensaje = error.error.mensaje;
          }

          // Caso texto plano
          else if (typeof error.error === 'string') {
            mensaje = error.error;
          }

        }

        this.notification.error(mensaje);

        return throwError(() => error);
      })
    );
  }
}
