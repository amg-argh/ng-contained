var testApp = angular.module("testApp",["contained"])
	
testApp.controller("test1Controller", ["$scope", "offsetFactory", function($scope, offsetFactory){
	$scope.content = [];
	
		var lo = new Lorem();

	$scope.content.push(lo.createText(15, 3));
	$scope.content.push(lo.createText(15, 3));
	$scope.content.push(lo.createText(15, 3));
	$scope.content.push(lo.createText(15, 3));

	$scope.addStuff = function(){
		$scope.content.push(lo.createText(15, 3));
	}
}]);
