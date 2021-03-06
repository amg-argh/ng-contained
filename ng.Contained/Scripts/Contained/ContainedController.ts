﻿module Contained {

	export interface SetPositionEventArgs {
		absolute?: number;
		relative?: number;
		relativeToBeRatio?: number;
	}

	export interface SetPositionEvent {
		(args: SetPositionEventArgs): void;
	}

    export interface ScrollToElementFunction {
        (element: HTMLElement, animate: boolean): void;
    }

    export interface IContainedELScope extends ng.IScope {
        identifier: string;
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

		scrollHandlers: IScrollHandler[];
		plugins: IContainedPlugin[];

        position: number;

        scrollToElement: ScrollToElementFunction;
	}

	export class ContainedEl implements ng.IDirective {
		static DirectiveId: string = "contained";

		restrict: string = "A";
		templateUrl: string = "../contained-template.html";
		transclude: boolean = true;
		replace: boolean = false;
		scope: any = {};

		private _thewindow: ng.IWindowService;
		private _scrollbarFactory: ScrollbarFactory;
		private _offsetFactory: OffsetFactory;

		constructor(private $window: ng.IWindowService, sbf: ScrollbarFactory, offsetFactory:OffsetFactory) {
			this._thewindow = $window;
			this._scrollbarFactory = sbf;
			this._offsetFactory = offsetFactory;
		}

		link = (scope: IContainedELScope, element: JQuery, attrs: ng.IAttributes) => {
            var el: HTMLElement = element[0];
            scope.identifier        = "contained";
			scope.el				= <HTMLDivElement>el;
			scope.position			= 0;
			scope.scrollbarEl		= <HTMLDivElement>el.querySelector(".contained-scrollbar");
			scope.scrollbarHandleEl = <HTMLDivElement>el.querySelector(".contained-scrollbar-handle");
			scope.wrapperEl			= <HTMLDivElement>el.querySelector(".contained-wrapped");
			scope.contentEl			= <HTMLDivElement>el.querySelector(".contained-container");

            scope.el.classList.add("contained-main");
            scope.contentEl.style.top = "0px";

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
            scope.scrollHandlers.push(new TouchScrollHandler(scope.wrapperEl, this.$window, scrollHandlerCallback));


			scope.plugins = [];
			scope.plugins.push(new Sticky(scope.contentEl, this._offsetFactory, scope));
			scope.plugins.push(new Waypoint(scope.contentEl, this._offsetFactory, scope));
			scope.plugins.push(new DefinedCompensation(attrs));

			scope.$on("$destroy", () => {
				scope.mutationObserver.disconnect();
				this._thewindow.removeEventListener("resize", onResize);
			});

			scope.$on("contained-set-position", (e:any, position: number, animate: boolean) => {
				this.setAbsolutePagePosition(scope, position, animate);
            });

            scope.scrollToElement = (element: HTMLElement, animate: boolean) => {
                var offset: Offset = this._offsetFactory.getOffset(element);
                var topCompensation: number = this.getTopCompensation(scope);

                var position: number = 0 - (offset.top - scope.position) + topCompensation;
                
                this.setAbsolutePagePosition(scope, position, animate);                
            };

            scope.$on("contained-scroll-to-element",(e: any, element: HTMLElement, animate: boolean) => {
                scope.scrollToElement(element, animate);				
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

			scope.plugins.forEach((plugin: IContainedPlugin) => {
				plugin.updatePositionInformation(scope);
			});

			scope.mutationObserver.observe(scope.el, scope.observes);
		}

		setPagePosition = (scope: IContainedELScope, args: SetPositionEventArgs) => {
			if (args.absolute !== undefined) {
				this.setAbsolutePagePosition(scope, args.absolute, false);
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
			this.setAbsolutePagePosition(scope, tempPosition, false);
		}

		setRelativeToBeRatioPagePosition = (scope: IContainedELScope, delta: number) => {
			var deltaRatio: number = delta / scope.wrapperHeight;
			var deltaPx: number = Math.ceil(deltaRatio * scope.contentHeight);

			var tempPosition: number = scope.position + deltaPx;

			this.setAbsolutePagePosition(scope, tempPosition, false);
		}

		setAbsolutePagePosition = (scope: IContainedELScope, position: number, animate:boolean) => {
			var tempPosition: number = position;

			if (scope.contentHeight <= scope.wrapperHeight) {
				tempPosition = 0;
			}
			else if (tempPosition < scope.maxPosition) {
				tempPosition = scope.maxPosition;
			}
			else if (tempPosition > 0) {
				tempPosition = 0;
			}

			if (scope.position === tempPosition)
				return;

			scope.position = tempPosition;
			this.updateContainerTransform(scope, animate);

			var totalCompensation: number = this.getTopCompensation(scope);

			scope.plugins.forEach((plugin: IContainedPlugin) => {
				plugin.test(scope, totalCompensation);
			});
		}

		getTopCompensation(scope: IContainedELScope): number {
			var totalCompensation: number = 0;
			scope.plugins.forEach((plugin: IContainedPlugin) => {
				totalCompensation += plugin.getTopCompensation(scope);
			});

			return totalCompensation;
		}

		updateContainerTransform(scope: IContainedELScope, animate: boolean) {
			
            var transitionEndEvent = () => {
                scope.contentEl.style.transition = "";
                scope.scrollbarHandleEl.style.transition = "";
                scope.contentEl.removeEventListener("transitionend", transitionEndEvent);
                finalize();
            };
            
            var init = () => {
                scope.mutationObserver.disconnect();
                if (animate) {
                    scope.contentEl.style.transition = "top 250ms ease-out";
                    scope.scrollbarHandleEl.style.transition = "all 250ms ease-out";
                    scope.contentEl.addEventListener("transitionend", transitionEndEvent);
                }
            }

            var action = () => {
                scope.contentEl.style.top = scope.position + "px";

                this._scrollbarFactory.renderScrollbar(
                    scope.scrollbarHandleEl,
                    scope.wrapperHeight,
                    scope.contentHeight,
                    scope.position
                );
            }

            var finalize = () => {
                scope.mutationObserver.observe(scope.el, scope.observes);
            }

            init();
            action();
            if (!animate) {
                finalize();
            }    			
		}

    }
}

contained.directive(Contained.ContainedEl.DirectiveId, ['$window', 'containedScrollbarFactory', 'containedOffsetFactory', ($window, containedScrollbarFactory, offsetFactory) => {
	return new Contained.ContainedEl($window, containedScrollbarFactory, offsetFactory);
}]);