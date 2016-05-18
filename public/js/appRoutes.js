angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginUserController'
		})

		.when('/dashboard', {
			templateUrl: 'views/dashboard.html',
			controller: 'DashboardController'
		})

		.when('/horses', {
			templateUrl: 'views/horse-listing.html',
			controller: 'ListHorsesController'
		})

		.when('/horses/new', {
			templateUrl: 'views/horse-new.html',
			controller: 'NewHorseController'
		})

		.when('/horses/:slug', {
			templateUrl: 'views/horse.html',
			controller: 'SingleHorseController'
		})

		.when('/horses/:slug/edit', {
			templateUrl: 'views/horse-edit.html',
			controller: 'EditHorseController'
		})

		.when('/geeks', {
			templateUrl: 'views/geek.html',
			controller: 'GeekController'	
		});

	$locationProvider.html5Mode(true);

}])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('HttpInterceptorService');
    //$httpProvider.defaults.withCredentials = true;
});