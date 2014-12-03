var testApp = angular.module("testApp", ["contained"])

testApp.controller("test2Controller", ["$scope", "containedOffsetFactory", function ($scope, offsetFactory) {
	$scope.currentWaypoint = "not set";

	$scope.$on("waypoint", function (e, waypoint) {
		$scope.currentWaypoint = waypoint;
		$scope.$apply();
	})
}]);
