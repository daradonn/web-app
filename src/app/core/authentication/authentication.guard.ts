/** Angular Imports */
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

/** Custom Services */
import { Logger } from '../logger/logger.service';
import { AuthenticationService } from './authentication.service';
import {OAuthService} from 'angular-oauth2-oidc';

/** Initialize logger */
const log = new Logger('AuthenticationGuard');

/**
 * Route access authorization.
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {

  /**
   * @param {Router} router Router for navigation.
   * @param {AuthenticationService} authenticationService Authentication Service.
   * @param oauthService
   */
  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private oauthService: OAuthService) {
    this.oauthService.tryLogin().then(value => {
    });
  }

  /**
   * Ensures route access is authorized only when user is authenticated, otherwise redirects to login.
   *
   * @returns {boolean} True if user is authenticated.
   */
  canActivate(): boolean {
    const hasIdToken = this.oauthService.hasValidIdToken();
    const hasAccessToken = this.oauthService.hasValidAccessToken();
    if (hasAccessToken) {
      return true;
    } else {
      // this.oauthService.logOut();
      // this.router.navigate(['/login'], { replaceUrl: true });
      this.router.navigate(['/login']);
      return false;
    }
    if (this.authenticationService.isAuthenticated()) {
      return true;
    }

    log.debug('User not authenticated, redirecting to login...');
    this.authenticationService.logout();
    // this.router.navigate(['/login'], { replaceUrl: true });
    this.router.navigate(['/login']);
    return false;
  }

}
