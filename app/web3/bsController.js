"use strict";

var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
	return $window._;
}]);

function BusinessSystemsController($scope, BusinessSystems, Messages, $log) {
	$scope.refresh = function() {
		BusinessSystems.fetch().success(function(data) {
			$scope.filteredBusinessSystems = $scope.businessSystems = data;
		}).error(function(data, status) {
			console.log(data, status);
			$scope.businessSystems = [];
		});

		Messages.fetch().success(function(data) {
			$scope.messages = data;
		}).error(function(data, status) {
			console.log(data, status);
			$scope.messages = [];
		});
	};

	$scope.refresh();

	$scope.checkBSButtonActive = function(iID) {
		if ($scope.findCanvasBusinessSystem(iID) === undefined) {
			return '';
		} else {
			return 'checked';
		}
	}

	$scope.checkMSButtonActive = function(iID) {
		if ($scope.findCanvasMessage(iID) === undefined) {
			return '';
		} else {
			return 'checked';
		}
	}

	$scope.filteredBusinessSystems = [];
	$scope.canvasBusinessSystems = [];
	$scope.filterBSValue = "";
	$scope.applicableMessages = []; // Set by selected business systems
	$scope.filteredMessages = []; // Set by name filter
	$scope.canvasMessages = [];
	$scope.filterMSValue = "";

	$scope.findFilteredBusinessSystem = function(iID) {
		return _.find($scope.filteredBusinessSystems, function(bs) {
			return (bs.id === iID);
		});
	}

	$scope.findCanvasBusinessSystem = function(iID) {
		return _.find($scope.canvasBusinessSystems, function(bs) {
			return (bs.ID === iID);
		});
	}

	$scope.findMessage = function(iID) {
		return _.find($scope.messages, function(msg) {
			return (msg.id === iID);
		});
	}

	$scope.findCanvasMessage = function(iID) {
		return canvas.findMessageByID(iID);
	}

	$scope.resetApplicableMessages = function() {
		$scope.applicableMessages = _.filter($scope.messages, function(msg) {
			return ($scope.findCanvasBusinessSystem(msg.senderID) !== undefined &&
				$scope.findCanvasBusinessSystem(msg.receiverID) !== undefined);
		});
	}

	$scope.register = function() {
		registerWebsocket();
	}

	$scope.bsSelect = function(bsID) {
		var selectedBS = $scope.findFilteredBusinessSystem(bsID);

		// TODO add check if BS already in scope.canvasBusinessSystems
		if (selectedBS !== undefined) {
			var newBS = canvas.addEndPoint(selectedBS.id, 10, 10, selectedBS.description);
			$scope.canvasBusinessSystems.push(newBS);
			canvas.dragObject = newBS;
			canvas.drag = true;
			$scope.resetApplicableMessages();
			$scope.setMSFilter($scope.filterMSValue);
		} else {
			console.log("undefined");
		}
	}

	$scope.messageSelect = function(msID) {
		var selectedMessage = $scope.findMessage(msID);

		if (selectedMessage !== undefined) {
			canvas.addMessage(selectedMessage.id,
				selectedMessage.senderID,
				selectedMessage.receiverID,
				selectedMessage.description);
		}
	}

	$scope.setBSFilter = function(param) {
		$scope.filterBSValue = param;
		$scope.filteredBusinessSystems = _.filter($scope.businessSystems, function(item) {
			return (item.description.toUpperCase().indexOf($scope.filterBSValue.toUpperCase()) > -1);
		});
	};

	$scope.setMSFilter = function(param) {
		$scope.filterMSValue = param;
		$scope.filteredMessages = _.filter($scope.applicableMessages, function(item) {
			return (item.description.toUpperCase().indexOf($scope.filterMSValue.toUpperCase()) > -1);
		});
	};

}

angular.module("my.module", [])
	.controller("BusinessSystemsController", BusinessSystemsController)
	.factory("BusinessSystems", ["$http", function($http) {

		function BusinessSystems() {}
		BusinessSystems.prototype.fetch = function fetch() {
			return $http.get("/api/bs");
		};
		return new BusinessSystems();
	}])
	.factory("Messages", ["$http", function($http) {
		function Messages() {}
		Messages.prototype.fetch = function fetch() {
			return $http.get("/api/messages");
		};
		return new Messages();

	}]);