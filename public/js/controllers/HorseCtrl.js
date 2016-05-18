angular.module('ListCtrl', []).controller('ListHorsesController', function($scope, HorseService, AuthService) {
	
	HorseService.list(function(horses) {
		$scope.horses = horses;
	})

	if(AuthService.isAuthenticated()) { 
		$scope.addHorse = '<a href="/horses/new">Add new horse</a>';
	}

});

angular.module('SingleCtrl', []).controller('SingleHorseController', function($scope, $routeParams, HorseService, AuthService) {

	$scope.horseId = $routeParams._id;
	$scope.horseSlug = $routeParams.slug;
	
	if(AuthService.isAuthenticated()) { 
		$scope.editHorse = '<a href="/horses/' + $scope.horseSlug +'/edit">Edit information</a>';
	}	

	HorseService.find($routeParams.slug, function(horse) {
		$scope.horse = horse;
	}); 


});

angular.module('AddNewCtrl', []).controller('NewHorseController', function($scope, HorseService, AuthService, $location) {

	if(AuthService.isAuthenticated()) { 

		$scope.formData = {};

		$scope.createHorse = function() {
			HorseService.add($scope.formData, function(data) {
				$scope.formData = {};
				$scope.data = data;
				$location.path('/horses');
			});
		};
	} else {
		$location.path('/login');
	}

/*

	$scope.createHorse = function() {
		$http.post('/api/horses/', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.formData = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
			
	}; */
});  

angular.module('EditCtrl', []).controller('EditHorseController', function($scope, $routeParams, HorseService, AuthService, $location) {

	if(AuthService.isAuthenticated()) { 

		$scope.horseId = $routeParams._id;
		$scope.horseSlug = $routeParams.slug;

		HorseService.find($routeParams.slug, function(horse) {	

			$scope.formData = {};

			$scope.horse = horse;
		  	$scope.formData.name = horse.name;
		  	$scope.formData.slug = horse.slug;
		  	$scope.formData.breed = horse.breed;
		  	$scope.formData.sex = horse.sex;
		  	$scope.formData.color = horse.color;
		  	
		});

		$scope.editHorse = function() {
			HorseService.update($routeParams.slug, $scope.formData, function(horse) {
				$scope.horse = horse;

				$location.path('/horses/' + $scope.horseSlug);
			});
		}
	} else {
		$location.path('/login');
	}

});

angular.module('RemoveCtrl', []).controller('RemoveHorseController', function($scope, $routeParams, HorseService, $location, $http) {

	$scope.horseId = $routeParams._id;
	$scope.horseSlug = $routeParams.slug;	

	$scope.removeHorse = function() {
		$http.delete('/api/horses/' + $routeParams.slug)
			.success(function(horse) {
				console.log(horse);
				$location.path('/horses/');
			})
			.error(function(horse) {
				console.log('Error: ' + horse);
			});
	}

});