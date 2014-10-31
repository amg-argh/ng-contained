module Contained {


	export interface SetPositionEventArgs {
		absolute?: number;
		relative?: number;
		relativeToBeRatio?: number;
	}

	export interface SetPositionEvent {
		(args: SetPositionEventArgs): void;
	}

	export interface IContainedELScope extends ng.IScope {
		observes: MutationObserverInit;
		mutationObserver: MutationObserver;

		el: HTMLDivElement;
		scrollbarEl: HTMLDivElement;
		scrollbarHandleEl: HTMLDivElement;
		wrapperEl: HTMLDivElement;
		contentEl: HTMLDivElement;

		wrapperHeight: number;
		contentHeight: number;
		maxPosition: number;

		scrollHandlers: IScrollHandler[]

		position: number;
	}

	export class ContainedEl implements ng.IDirective {
		static DirectiveId: string = "contained";

		restrict: string = "A";
		templateUrl: string = "/contained-template.html";
		transclude: boolean = true;
		replace: boolean = false;

		private _thewindow: ng.IWindowService;
		private _scrollbarFactory: ScrollbarFactory;

		constructor(private $window: ng.IWindowService, sbf: ScrollbarFactory) {
			this._thewindow = $window;
			this._scrollbarFactory = sbf;
		}

		link = (scope: IContainedELScope, element: JQuery, attrs: ng.IAttributes) => {
			var el: HTMLElement = element[0];
			scope.el				= <HTMLDivElement>el;
			scope.position			= 0;
			scope.scrollbarEl		= <HTMLDivElement>el.querySelector(".contained-scrollbar");
			scope.scrollbarHandleEl = <HTMLDivElement>el.querySelector(".contained-scrollbar-handle");
			scope.wrapperEl			= <HTMLDivElement>el.querySelector(".contained-wrapped");
			scope.contentEl			= <HTMLDivElement>el.querySelector(".contained-container");

			scope.observes = {childList: true, attributes: true, characterData: true, subtree: true};
			scope.mutationObserver = new MutationObserver((arr: MutationRecord[], observer: MutationObserver) => {
				this.recalculate(scope);
			});
			scope.mutationObserver.observe(el, scope.observes);

			var onResize: EventListener = (e: UIEvent) => {
				this.recalculate(scope);
			};
			this._thewindow.addEventListener("resize", onResize);

			
			scope.scrollHandlers = [];
			var scrollHandlerCallback: SetPositionEvent = (args: SetPositionEventArgs) => {
				this.setPagePosition(scope, args);
			};
			scope.scrollHandlers.push(new WheelScrollHandler(scope.wrapperEl, this.$window, scrollHandlerCallback));
			scope.scrollHandlers.push(new ScrollbarDragScrollHandler(scope.scrollbarHandleEl, this.$window, scrollHandlerCallback));
			scope.scrollHandlers.push(new ScrollbarClickScrollHandler(scope.scrollbarEl, this.$window, scrollHandlerCallback));


			scope.$on("$destroy", () => {
				scope.mutationObserver.disconnect();
				this._thewindow.removeEventListener("resize", onResize);
			});

			//now that we're all configed runnnnnnnnnn
			this.recalculate(scope);
		}
		
		recalculate = (scope: IContainedELScope) => {
			scope.mutationObserver.disconnect();
			scope.wrapperHeight = scope.wrapperEl.clientHeight;
			scope.contentHeight = scope.contentEl.clientHeight;
			scope.maxPosition	= 0 - (scope.contentHeight - scope.wrapperHeight);


			this._scrollbarFactory.renderScrollbar(
				scope.scrollbarHandleEl,
				scope.wrapperHeight,
				scope.contentHeight,
				scope.position
				);

			scope.mutationObserver.observe(scope.el, scope.observes);
		}

		setPagePosition = (scope: IContainedELScope, args: SetPositionEventArgs) => {
			if (args.absolute !== undefined) {
				this.setAbsolutePagePosition(scope, args.absolute);
			}
			else if (args.relative !== undefined) {
				this.setRelativePagePosition(scope, args.relative);
			}
			else if (args.relativeToBeRatio !== undefined) {
				this.setRelativeToBeRatioPagePosition(scope, args.relativeToBeRatio);
			}
			else {
				throw "Err ahh, need something bro...";
			}
		}

		setRelativePagePosition = (scope: IContainedELScope, delta: number) => {
			var tempPosition = scope.position + delta;
			this.setAbsolutePagePosition(scope, tempPosition);			
		}

		setRelativeToBeRatioPagePosition = (scope: IContainedELScope, delta: number) => {
			var deltaRatio: number = delta / scope.wrapperHeight;
			var deltaPx: number = Math.ceil(deltaRatio * scope.contentHeight);

			var tempPosition: number = scope.position + deltaPx;

			this.setAbsolutePagePosition(scope, tempPosition);
		}

		setAbsolutePagePosition = (scope: IContainedELScope, position: number) => {
			var tempPosition: number = position;

			if (tempPosition < scope.maxPosition) {
				tempPosition = scope.maxPosition;
			}
			else if (tempPosition > 0) {
				tempPosition = 0;
			}
			
			scope.position = tempPosition;
			this.updateContainerTransform(scope);
		}

		updateContainerTransform(scope: IContainedELScope) {
			scope.mutationObserver.disconnect();

			var translation = "translate3d(0, " + scope.position + "px, 0)";
			scope.contentEl.style.transform = translation;

			this._scrollbarFactory.renderScrollbar(
				scope.scrollbarHandleEl,
				scope.wrapperHeight,
				scope.contentHeight,
				scope.position
				);


			scope.mutationObserver.observe(scope.el, scope.observes);
		}
	}
}

contained.directive(Contained.ContainedEl.DirectiveId, ['$window', 'containedScrollbarFactory', ($window, containedScrollbarFactory) => {
	return new Contained.ContainedEl($window, containedScrollbarFactory);
}]);