# oauth2-angular-phonegap

This module is based on [oauth2-angular](https://github.com/seegno/angular-oauth2) from seegno, tks guys!

######All modification made here is to ensure the proper work with [laravel passaport](https://laravel.com/docs/master/passport) and [phonegap](http://phonegap.com) projects

Just a feel modification was made:
```
1 - remove ngCookies and use local storage instead
2 - oauth config was changed to satisfy the laravel passport requirements
3 - interceptors was changed to satisfy the laravel passport requirements
```
 
 

## Usage

###### 1. Download `oauth2-angular-phonegap` dependencies.

* [angular](https://github.com/angular/bower-angular)
* [query-string](https://github.com/sindresorhus/query-string)

If you're using `bower` they will be automatically downloaded upon installing this library.

###### 2. Include `oauth2-angular-phonegap` and dependencies.

```html
<script src="<VENDOR_FOLDER>/angular/angular.min.js"></script>
<script src="<VENDOR_FOLDER>/query-string/query-string.js"></script>
<script src="<VENDOR_FOLDER>/oauth2-angular-phonegap/dist/oauth2-angular-phonegap.min.js"></script>
```

###### 3. Configure `OAuth` (optional) and `OAuthToken` (optional):

```js
angular.module('myApp', ['oauth2-angular-phonegap'])
  .config(['OAuthProvider', function(OAuthProvider) {
    OAuthProvider.configure({
      baseUrl: 'https://api.website.com',
      clientId: 'CLIENT_ID',
      clientSecret: 'CLIENT_SECRET' // optional
    });
  }]);
```

You can also configure `OAuth` service in a `.run()` block, in case you retrieve the Oauth server configuration from a ajax request.

```js
angular.module('myApp', ['oauth2-angular-phonegap'])
  .run(['OAuth', function(OAuth) {
    OAuth.configure({
      baseUrl: 'https://api.website.com',
      clientId: 'CLIENT_ID',
      clientSecret: 'CLIENT_SECRET' // optional
    });
  }]);
```

###### 4. Catch `OAuth` errors and do something with them (optional):

```js
angular.module('myApp', ['oauth2-angular-phonegap'])
  .run(['$rootScope', '$window', 'OAuth', function($rootScope, $window, OAuth) {
    $rootScope.$on('oauth:error', function(event, rejection) {
      // Ignore `invalid_grant` error - should be catched on `LoginController`.
      if ('invalid_grant' === rejection.data.error) {
        return;
      }

      // Refresh token when a `invalid_token` error occurs.
      if ('invalid_token' === rejection.data.error) {
        return OAuth.getRefreshToken();
      }

      // Redirect to `/login` with the `error_reason`.
      return $window.location.href = '/login?error_reason=' + rejection.data.error;
    });
  }]);
```

## API

#### OAuthProvider

Configuration defaults:

```js
OAuthProvider.configure({
  baseUrl: null,
  clientId: null,
  clientSecret: null,
  grantPath: '/oauth/token',
  revokePath: '/oauth/revoke'
});
```

#### OAuth

Update configuration defaults:

```js
OAuth.configure({
  baseUrl: null,
  clientId: null,
  clientSecret: null,
  grantPath: '/oauth/token',
  revokePath: '/oauth/revoke'
});

```
Check authentication status:

```js
/**
 * Verifies if the `user` is authenticated or not based on the `token`
 * cookie.
 *
 * @return {boolean}
 */

OAuth.isAuthenticated();
```

Get an access token:

```js
/**
 * Retrieves the `access_token` and stores the `response.data` on cookies
 * using the `OAuthToken`.
 *
 * @param {object} user - Object with `username` and `password` properties.
 * @param {object} config - Optional configuration object sent to `POST`.
 * @return {promise} A response promise.
 */

OAuth.getAccessToken(user, options);
```

Refresh access token:

```js
/**
 * Retrieves the `refresh_token` and stores the `response.data` on cookies
 * using the `OAuthToken`.
 *
 * @return {promise} A response promise.
 */

OAuth.getRefreshToken()
```

Revoke access token:

```js
/**
 * Revokes the `token` and removes the stored `token` from cookies
 * using the `OAuthToken`.
 *
 * @return {promise} A response promise.
 */

OAuth.revokeToken()
```

**NOTE**: An *event* `oauth:error` will be sent everytime a `responseError` is emitted:

* `{ status: 400, data: { error: 'invalid_request' }`
* `{ status: 400, data: { error: 'invalid_grant' }`
* `{ status: 401, data: { error: 'invalid_token' }`
* `{ status: 401, headers: { 'www-authenticate': 'Bearer realm="example"' } }`

#### OAuthTokenProvider

Configuration defaults:

```js
OAuthTokenProvider.configure({
  name: 'token'
});
```

#### References

[angular-oauth2 from seegno](https://github.com/seegno/angular-oauth2).