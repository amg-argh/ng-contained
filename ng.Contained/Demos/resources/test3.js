var testApp = angular.module("testApp", ["contained"])

testApp.controller("test3Controller", ["$scope", "containedOffsetFactory", function ($scope, offsetFactory) {
	$scope.goTo = function () {
		var el = document.getElementById("four");
		$scope.$broadcast("contained-scroll-to-element", el);
	}
}]);
