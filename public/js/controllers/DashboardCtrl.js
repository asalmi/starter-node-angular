angular.module('DashboardCtrl', []).controller('DashboardController', function($scope, AuthService, $location, $rootScope) {

    if(AuthService.isAuthenticated()) {
    	$scope.title = 'isAuthenticated'

    	$scope.logout = function() {
	    	AuthService.logout();
	    	$rootScope.$broadcast('userLoggedOut');
	    	$location.path('/');
    	}
    } else {
    	$location.path('/login');
    }
});