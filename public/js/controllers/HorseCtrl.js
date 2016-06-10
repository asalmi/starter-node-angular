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
		console.log(horse);
	}); 

});

angular.module('AddNewCtrl', []).controller('NewHorseController', function($scope, HorseService, AuthService, $location, Upload, $window) {

	if(AuthService.isAuthenticated()) { 

		$scope.today = function() {
		    $scope.dt = new Date();
		  };
		  $scope.today();

		  $scope.clear = function() {
		    $scope.dt = null;
		  };

		  $scope.inlineOptions = {
		    customClass: getDayClass,
		    minDate: new Date(),
		    showWeeks: true
		  };

		  $scope.dateOptions = {
		    dateDisabled: disabled,
		    formatYear: 'yy',
		    maxDate: new Date(2020, 5, 22),
		    minDate: new Date(),
		    startingDay: 1
		  };

		  // Disable weekend selection
		  function disabled(data) {
		    var date = data.date,
		      mode = data.mode;
		    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		  }

		  $scope.toggleMin = function() {
		    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
		    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
		  };

		  $scope.toggleMin();

		  $scope.open1 = function() {
		    $scope.popup1.opened = true;
		  };

		  $scope.open2 = function() {
		    $scope.popup2.opened = true;
		  };

		  $scope.setDate = function(year, month, day) {
		    $scope.dt = new Date(year, month, day);
		  };

		  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		  $scope.format = $scope.formats[0];
		  $scope.altInputFormats = ['M!/d!/yyyy'];

		  $scope.popup1 = {
		    opened: false
		  };

		  $scope.popup2 = {
		    opened: false
		  };

		  var tomorrow = new Date();
		  tomorrow.setDate(tomorrow.getDate() + 1);
		  var afterTomorrow = new Date();
		  afterTomorrow.setDate(tomorrow.getDate() + 1);
		  $scope.events = [
		    {
		      date: tomorrow,
		      status: 'full'
		    },
		    {
		      date: afterTomorrow,
		      status: 'partially'
		    }
		  ];

		  function getDayClass(data) {
		    var date = data.date,
		      mode = data.mode;
		    if (mode === 'day') {
		      var dayToCheck = new Date(date).setHours(0,0,0,0);

		      for (var i = 0; i < $scope.events.length; i++) {
		        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

		        if (dayToCheck === currentDay) {
		          return $scope.events[i].status;
		        }
		      }
		    }

		    return '';
		  }

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
           	$scope.formData.DOB = $scope.dt;

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

		$scope.today = function() {
		    $scope.dt = new Date();
		  };
		  $scope.today();

		  $scope.clear = function() {
		    $scope.dt = null;
		  };

		  $scope.inlineOptions = {
		    customClass: getDayClass,
		    minDate: new Date(),
		    showWeeks: true
		  };

		  $scope.dateOptions = {
		    dateDisabled: disabled,
		    formatYear: 'yy',
		    maxDate: new Date(2020, 5, 22),
		    minDate: new Date(),
		    startingDay: 1
		  };

		  // Disable weekend selection
		  function disabled(data) {
		    var date = data.date,
		      mode = data.mode;
		    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		  }

		  $scope.toggleMin = function() {
		    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
		    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
		  };

		  $scope.toggleMin();

		  $scope.open1 = function() {
		    $scope.popup1.opened = true;
		  };

		  $scope.open2 = function() {
		    $scope.popup2.opened = true;
		  };

		  $scope.setDate = function(year, month, day) {
		    $scope.dt = new Date(year, month, day);
		  };

		  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		  $scope.format = $scope.formats[0];
		  $scope.altInputFormats = ['M!/d!/yyyy'];

		  $scope.popup1 = {
		    opened: false
		  };

		  $scope.popup2 = {
		    opened: false
		  };

		  var tomorrow = new Date();
		  tomorrow.setDate(tomorrow.getDate() + 1);
		  var afterTomorrow = new Date();
		  afterTomorrow.setDate(tomorrow.getDate() + 1);
		  $scope.events = [
		    {
		      date: tomorrow,
		      status: 'full'
		    },
		    {
		      date: afterTomorrow,
		      status: 'partially'
		    }
		  ];

		  function getDayClass(data) {
		    var date = data.date,
		      mode = data.mode;
		    if (mode === 'day') {
		      var dayToCheck = new Date(date).setHours(0,0,0,0);

		      for (var i = 0; i < $scope.events.length; i++) {
		        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

		        if (dayToCheck === currentDay) {
		          return $scope.events[i].status;
		        }
		      }
		    }

		    return '';
		  }

		HorseService.find($routeParams.slug, function(horse) {	

			$scope.formData = {};

			console.log(horse);

			$scope.horse = horse;
		  	$scope.formData.name = horse.name;
		  	$scope.formData.DOB = horse.DOB;
		  	$scope.formData.photos = horse.photos;
		  	$scope.formData.slug = horse.slug;
		  	$scope.formData.breed = horse.breed;
		  	$scope.formData.sex = horse.sex;
		  	$scope.formData.color = horse.color;
		  	$scope.formData.offspring = horse.offspring;

		  	if(horse.pedigree.sire != null) {
		  		$scope.formData.sire = horse.pedigree.sire._id;
		  	} else {
		  		$scope.formData.sire = '';
		  	}
		  	if(horse.pedigree.dam != null) {
		  		$scope.formData.dam = horse.pedigree.dam._id;
		  	} else {
		  		$scope.formData.dam = '';
		  	}
		  	 
		});

		$scope.editHorse = function() {

			$scope.formData.slug = Slug.slugify($scope.formData.name); 
			$scope.formData.DOB = $scope.dt;

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