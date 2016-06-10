angular.module('MainCtrl', ['ngSanitize']).controller('MainController', function($scope, AuthService, $location, $cookies, $rootScope) {

	$scope.site = {
            title: 'Lorem Ipsum Dolor',
            footer: 'Copyright 2014 Angular CMS'
        };

    $scope.navLinks = [
    	{
        	title: 'Horses',
        	url: '/horses'
     	},
        {
          	title: "Activity",
          	url: "/activity"
        } ];

    $scope.adminMenuLinks = [
        {
            title: 'Dashboard',
            url: '/dashboard'
        }];    
/*
    $rootScope.$on('userLoggedIn', function () {
      $scope.adminMenuLinks = [
        {
            title: 'Dashboard',
            url: '/dashboard'
        }];
    });
*/
    /*
    $rootScope.$on('userLoggedOut', function () {
      $scope.adminMenuLinks = [
        {
          title: 'Login',
          url: '/login'
        }];

    }); */

    
});