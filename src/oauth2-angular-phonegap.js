
/**
 * Module dependencies.
 */

import angular from 'angular';
import OAuthProvider from './providers/oauth-provider';
import OAuthTokenProvider from './providers/oauth-token-provider';
import oauthConfig from './config/oauth-config';
import oauthInterceptor from './interceptors/oauth-interceptor';

var ngModule = angular.module('oauth2-angular-phonegap', [])
  .config(oauthConfig)
  .factory('oauthInterceptor', oauthInterceptor)
  .provider('OAuth', OAuthProvider)
  .provider('OAuthToken', OAuthTokenProvider)
;

/**
 * Export `oauth2-angular-phonegap`.
 */

export default ngModule;
