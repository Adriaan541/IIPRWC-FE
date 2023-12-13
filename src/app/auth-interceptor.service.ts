import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipIntercept = request.headers.has("skip");

    // Certain requests get the header: {skip: "true"} so the response can be viewed without requiring login
    if (skipIntercept) {
      const clonedRequest = request.clone({
        headers: request.headers.delete("skip")
      });
      return next.handle(clonedRequest);
    }

    const idToken = localStorage.getItem("id_token");

    if (idToken) {
      if (!this.authService.isLoggedIn()) {
        this.router.navigateByUrl('/auth/login');
      }

      const clonedRequest = request.clone({
        headers: request.headers.set("Authorization",
          "Bearer " + idToken)
      });

      return next.handle(clonedRequest);
    } else {
      return next.handle(request);
    }
  }
}
