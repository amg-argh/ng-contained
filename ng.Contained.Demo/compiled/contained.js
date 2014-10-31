var contained = angular.module('contained', []);
var Contained;
(function (Contained) {
    var ContainedEl = (function () {
        function ContainedEl($window) {
            var _this = this;
            this.$window = $window;
            this.restrict = "E";
            this.templateUrl = "/resources/contained-template.html";
            this.transclude = true;
            this.replace = true;
            this.link = function (scope, element, attrs) {
                var mutationObserver = new MutationObserver(_this.onMutation);
                mutationObserver.observe(element[0], { childList: true, attributes: true });
            };
            this.onMutation = function (arr, observer) {
                console.log(arr);
            };
        }
        ContainedEl.DirectiveId = "contained";
        return ContainedEl;
    })();
    Contained.ContainedEl = ContainedEl;
})(Contained || (Contained = {}));

contained.directive(Contained.ContainedEl.DirectiveId, [
    '$window', function ($window) {
        return new Contained.ContainedEl($window);
    }]);
var Contained;
(function (Contained) {
    var MutationFactory = (function () {
        function MutationFactory() {
        }
        MutationFactory.prototype.init = function () {
        };
        MutationFactory.serviceId = "mutationFactory";
        return MutationFactory;
    })();
    Contained.MutationFactory = MutationFactory;
})(Contained || (Contained = {}));

contained.factory(Contained.MutationFactory.serviceId, [
    function () {
        return new Contained.MutationFactory();
    }
]);
var Contained;
(function (Contained) {
    var OffsetFactory = (function () {
        function OffsetFactory() {
        }
        OffsetFactory.prototype.doSomething = function () {
            //alert(" I am doing something");
        };
        OffsetFactory.serviceId = "offsetFactory";
        return OffsetFactory;
    })();
    Contained.OffsetFactory = OffsetFactory;
})(Contained || (Contained = {}));

contained.factory(Contained.OffsetFactory.serviceId, [
    function () {
        return new Contained.OffsetFactory();
    }
]);
//# sourceMappingURL=contained.js.map
