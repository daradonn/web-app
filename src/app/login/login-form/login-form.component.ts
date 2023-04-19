/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

/** rxjs Imports */
import { finalize } from 'rxjs/operators';

/** Custom Services */
import { AuthenticationService } from '../../core/authentication/authentication.service';
import {OAuthService} from 'angular-oauth2-oidc';
import {JwksValidationHandler} from 'angular-oauth2-oidc-jwks';
import {authCodeFlowConfig} from '../../sso-config';

/**
 * Login form component.
 */
@Component({
  selector: 'mifosx-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  /** Login form group. */
  loginForm: UntypedFormGroup;
  /** Password input field type. */
  passwordInputType: string;
  /** True if loading. */
  loading = false;

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {AuthenticationService} authenticationService Authentication Service.
   * @param oauthService
   */
  constructor(private formBuilder: UntypedFormBuilder,
              private authenticationService: AuthenticationService,
              private oauthService: OAuthService) {  }

  /**
   * Creates login form.
   *
   * Initializes password input field type.
   */
  ngOnInit() {
    // this.configSSO();
    this.createLoginForm();
    this.passwordInputType = 'password';
    // this.authenticationService.getUserDetailsByToken();
  }

  configSSO() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(r => this.oauthService.tryLogin());
    // this.oauthService.setStorage(localStorage);

  }


  /**
   * Authenticates the user if the credentials are valid.
   */
  loginSSO() {
    // this.oauthService.initCodeFlow();
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
    // this.router.navigate(['/login'], { replaceUrl: true });
  }

  get token() {
    const claims: any = this.oauthService.getAccessToken();
    alert(claims);
    return claims ? claims : null;
  }


  login() {
    this.loading = true;
    this.loginForm.disable();
    this.authenticationService.login(this.loginForm.value)
      .pipe(finalize(() => {
        this.loginForm.reset();
        this.loginForm.markAsPristine();
        // Angular Material Bug: Validation errors won't get removed on reset.
        this.loginForm.enable();
        this.loading = false;
      })).subscribe();
  }

  /**
   * TODO: Decision to be taken on providing this feature.
   */
  forgotPassword() {
    console.log('Forgot Password feature currently unavailable.');
  }

  /**
   * Creates login form.
   */
  private createLoginForm() {
    this.loginForm = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
      'remember': false
    });
  }

}
