import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { SpinnerUtilService } from 'spinner-util';

@Injectable()
export class SpinnerHttpInterceptor implements HttpInterceptor {
  private activeRequests = 0;
  private spinnerVisible = false;
  private stateUpdate?: ReturnType<typeof setTimeout>;

  constructor(private spinnerService: SpinnerUtilService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    this.activeRequests++;
    this.scheduleStateUpdate();

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        this.scheduleStateUpdate();
      }),
    );
  }

  private scheduleStateUpdate(): void {
    if (this.stateUpdate !== undefined) {
      return;
    }

    this.stateUpdate = setTimeout(() => {
      this.stateUpdate = undefined;
      const shouldShow = this.activeRequests > 0;

      if (shouldShow === this.spinnerVisible) {
        return;
      }

      this.spinnerVisible = shouldShow;
      if (shouldShow) {
        this.spinnerService.show();
      } else {
        this.spinnerService.hide();
      }
    });
  }
}
