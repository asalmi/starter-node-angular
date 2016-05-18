angular.module('LoginCtrl', []).controller('LoginUserController', function($scope, $location, AuthService, flashMessageService, $rootScope) {
	
	$scope.credentials = {
    username: '',
    password: ''
  };

  $scope.login = function() {
      AuthService.login($scope.credentials).then(function(msg) {
        console.log('logged in!');
        //$rootScope.$broadcast('userLoggedIn');
        $location.path('/dashboard');
        //$state.go('inside');
      }, function(errMsg) {
        console.log(errMsg);
      });
    };

  /*
  $rootScope.logout = function() {
    AuthService.logout();
    $rootScope.$broadcast('userLoggedOut');
  }; */
  
});


