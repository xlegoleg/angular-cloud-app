import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { NotificationService } from '../notification.service';
import {catchError, tap} from 'rxjs/operators';
import {checkErrorCode} from "./check-error-code.util";

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: unknown) => {
        const url = new URL(request.url);
        const defaultMessage = `Request to "${url.pathname}" failed. Check the console for the details`;
        const message = checkErrorCode((err as HttpErrorResponse)?.status);

        this.notificationService.showError(
          message || defaultMessage,
          0
        );
        return throwError(err);
      })
    );
  }
}
