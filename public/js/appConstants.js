angular.module('appConstants', [])
 
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
 
.constant('API_ENDPOINT', {
  url: 'http://10.0.3.2:8080/api'
  //  For a simulator use: url: 'http://127.0.0.1:8080/api'
});