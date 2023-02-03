"use strict";


function BodyController($scope, Body) {

	// $scope.todos = Todos;

	$scope.save = function() {
		$scope.bodyItems.push({ // === $scope.todos.push
			name: "Dynamically injected",
			completed: true
		});
		$scope.$applyAsync();

	};

	$scope.refresh = function() {
		Body.fetch().success(function(data) {
			$scope.bodyItems = data;
		}).error(function(data, status) {
			console.log(data, status);
			$scope.bodyItems = [];
		});
	};

	// $scope.refresh();

}

angular.module("my.body", ["my.module"])
	.controller("BodyController", BodyController)
	.factory("Body", ["$http", function($http) {

		function Body() {}
		Body.prototype.fetch = function fetch() {
			return null; // $http.get("/api/bsz");
		};

		return new Body();

	}]);