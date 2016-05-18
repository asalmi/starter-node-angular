angular.module('AuthService', []).factory('AuthService', function($http, $q, API_ENDPOINT, $location) {

  var LOCAL_TOKEN_KEY = 'GYw`WcxTdWuA';
  var isAuthenticated = false;
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }
 
  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  loadUserCredentials();

  return {
    
    /*login: function(credentials, callback) {
      $http.post('/api/login', credentials).success(function(data) {
        var data = data;
        callback(data); 
       })
    },*/


    login: function(user) {
      console.log('login: ');
      return $q(function(resolve, reject) {
        $http.post(API_ENDPOINT.url + '/login', user).then(function(results) {
          if(results.data.success) {
            storeUserCredentials(results.data.token);
            resolve(results.data.msg);
          } else {
            reject(results.data.msg);
            console.log('result error');
          }
        });
      });
    },

    logout: function() {
      destroyUserCredentials();
      $location.path('/');
    },

    isAuthenticated: function() {
      return isAuthenticated;
    }
  } 

})

.factory('HttpInterceptorService', function($rootScope, $q, AUTH_EVENTS) {

  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };

  /*
    return {
      response: function(response) {
          return response;
      },

      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          return $q.reject(response);
        }
        return $q.reject(response);
      }

    } */
});


