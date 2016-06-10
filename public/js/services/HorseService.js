angular.module('HorseService', [])

.factory('HorseService', function($http, $route, $location) {

 	return {

 		list: function(callback) {
 			$http.get('/api/horses').success(callback);
 		},

 		find: function(name, callback) {
 			$http.get('/api/horses/' + name).success(function(horse) {
			  	var horse = horse;
			  	callback(horse);
			});
 		},

 		add: function(horseData, callback) {
 			$http.post('/api/horses/', horseData).success(function(data) {
				var data = data;
				callback(data);	
			});
			
 		},

 		update: function(name, horseData, callback) {
			$http.put('/api/horses/' + name, horseData).success(function(horse) {
				//console.log('horse edit!');
				var horse = horse;
				callback(horse);
			});
		}

 	};

});
