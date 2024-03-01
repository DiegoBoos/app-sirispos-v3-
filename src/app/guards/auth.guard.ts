import { CanMatchFn, Route, UrlSegment } from "@angular/router";
import { AuthService } from "../auth/services/auth.service";
import { inject } from "@angular/core";

export const canMatchAuth: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return inject(AuthService).checkAuthStatus();
};

export const canMatchByRole: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return inject(AuthService).checkRole(route);
};
