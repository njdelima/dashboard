var app = angular.module('DashboardApp', [])
	.controller("WeatherController", function ($scope, $http) {

		var API_KEY = "95772cc7ce61fd5af3b85f9f73f377bf";

		$scope.loc = "";
		$scope.city = "";
		$scope.temperature = "0";

		var ipInfo = $http.get('http://ipinfo.io/')
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				return err;
			});

		ipInfo.success(function(data) {
			$scope.loc = data.loc;
			storeCityName(data.loc);
		});

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(storeLocation);
		} else {
			console.log("Geolocation is not supported by this browser");
		}

		function storeLocation(position) {
			var commaCoords = position.coords.latitude + "," + position.coords.longitude;
			$scope.loc = commaCoords;
			storeCityName(commaCoords);
		}
		function storeCityName(commaCoords) {
			var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + commaCoords;
			var cityInfo = $http.get(url)
				.success(function(data) {
					return data;
				})
				.error(function(err) {
					return err;
				});

			cityInfo.success(function(data) {
				var city = "";
				var state = "";
				var arr = data.results[0].address_components;
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].types.indexOf("locality") != -1) {
						city = arr[i].short_name;
					}
					if (arr[i].types.indexOf("administrative_area_level_1") != -1) {
						state = arr[i].short_name;
					}
				}
				$scope.city = city + ", " + state;
				storeTemperature(commaCoords);
			});
		}

		function storeTemperature(commaCoords) {
			var weatherUrl = 'https://api.forecast.io/forecast/' + API_KEY + '/' + commaCoords + '?callback=JSON_CALLBACK';
			console.log("weatherUrl = " + weatherUrl);
			var weatherInfo = $http.jsonp(weatherUrl)
				.success(function(data) {
					return data;
				})
				.error(function(err) {
					return err;
				});
			weatherInfo.success(function(data) {
				console.log("reached success");
				$scope.temperature = data.currently.temperature;
			});
			weatherInfo.error(function(err) {
				console.log("reached error " + err);
			});
		}

	});