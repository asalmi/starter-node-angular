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

angular.module('AddNewCtrl', []).controller('NewHorseController', function($scope, HorseService, AuthService, $location, Upload, $window) {

	if(AuthService.isAuthenticated()) { 

		$scope.formData = {};

		//var vm = $scope.formData.photo;

		$scope.upload = function (file) {
	        Upload.upload({
	            url: 'http://10.0.3.2:8080/api/upload',
	            data: {imgName: $scope.slug, file:file},
	        }).then(function (resp) {
	        	console.log(resp.config.data);
	            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
	            console.log(resp.data);

		            
				HorseService.add($scope.formData, function(data) {
					$scope.formData = {};
					$scope.data = data;
					$location.path('/horses');
				});



	        }, function (resp) {
	            console.log('Error status: ' + resp.status);
	        }, function (evt) {
	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
	        });
	    };

		$scope.createHorse = function() {

            //upload($scope.formData.photos); //call upload function
            $scope.slug = $scope.formData.slug;
            //$scope.
           	$scope.upload($scope.formData.photo);

			/*
            function upload (file) {
            	console.log('inside upload');
	            Upload.upload({
	                url: 'http://10.0.3.2:8080/api/upload', //webAPI exposed to upload the file
	                data:{file:file} //pass file as data, should be user ng-model
	            }).then(function (resp) { //upload function returns a promise
	                if(resp.data.error_code === 0){ //validate success
	                    $window.alert('Success ' + resp.config.data.file.title + 'uploaded. Response: ');
	                } else {
	                    $window.alert('an error occured');
	                }
	            }, function (resp) { //catch error
	                console.log('Error status: ' + resp.status);
	                $window.alert('Error status: ' + resp.status);
	            }, function (evt) { 
	                console.log(evt);
	                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.title);
	                //vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
	            });
	        }; */

	        console.log();

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

angular.module('EditCtrl', []).controller('EditHorseController', function($scope, $routeParams, HorseService, AuthService, $location, Slug) {

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

			$scope.formData.slug = Slug.slugify($scope.formData.name); 

			HorseService.update($routeParams.slug, $scope.formData, function(horse) {

				$scope.horse = horse;
				$location.path('/horses/' + $scope.formData.slug);
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