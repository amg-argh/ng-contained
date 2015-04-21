module Contained {
    
    export class ContainedAnchorLink implements ng.IDirective {
        static DirectiveId = "containedAnchorLink";

        restrict = "A";

        link = (scope: ng.IScope, element: JQuery, attrs: ng.IAttributes) => {

            var containedScope: IContainedELScope = <IContainedELScope>scope["$$prevSibling"];
            var linkIdentifier: string = attrs["containedAnchorLink"];
            
            element.bind("click",(e) => {
                var selector = `[contained-anchor-point="${linkIdentifier}"]`;
                var wereLookingFor = <HTMLElement>containedScope.el.querySelector(selector);

                if (!wereLookingFor) {
                    return;
                }

                containedScope.scrollToElement(wereLookingFor, true);
            });            
        }
    }
} 

contained.directive(Contained.ContainedAnchorLink.DirectiveId, [() => {
    return new Contained.ContainedAnchorLink();
}]);