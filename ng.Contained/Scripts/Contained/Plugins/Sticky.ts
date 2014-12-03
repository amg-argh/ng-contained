﻿module Contained {

	export class StickyElement {
		public element: HTMLElement;
		public placeholder: HTMLElement;
		public start: number;
		public height: number;
		public width: number;
		public stuck: boolean;
		public positionSelf: boolean;
		public usePlaceholder: boolean;
	}

	export class Sticky implements IContainedPlugin {
		private stickies: StickyElement[];
		private offsetFactory: OffsetFactory;
		private container: HTMLElement;

		constructor(container: HTMLElement, offsetFactory: OffsetFactory) {
			this.offsetFactory = offsetFactory;
			this.container = container;		

			this.updatePositionInformation();	
		}

		updatePositionInformation(): void {
			this.stickies = [];
			var stickyComps: NodeList = this.container.querySelectorAll("[snoop]"); //<-- because it's sticky iky iky

			if (stickyComps.length === 0) {
				return;
			}

			for (var i: number = 0; i < stickyComps.length; i++) {
				var el: HTMLElement = <HTMLElement>stickyComps[i];
				var offset: Offset = this.offsetFactory.getOffset(el);

				this.stickies.push({
					element: el,
					start: offset.top,
					height: el.clientHeight,
					width: el.clientWidth,
					placeholder: null,
					stuck: false,
					positionSelf: true,
					usePlaceholder: true
				});
			}
		}

		destroy(): void {

		}
		
		test(scope: IContainedELScope): void {			
			if (!this.stickies || this.stickies.length === 0)
				return;

			//just for now only deal with the first sticky; not sure if we should stack them
			//or replace them
			var sticky: StickyElement = this.stickies[0];
			var pos: number = Math.abs(scope.position);
			var stuck: boolean = pos > sticky.start;
			
			if (stuck === sticky.stuck) {
				//bail when there's nothing to change
				return;
			}

			var removePlaceholder = () => {
				//it seems to be inconsistent; for now just cur all stuck-placeholder
				var allPlaceholders: NodeList = this.container.querySelectorAll(".stuck-placeholder");
				for (var i: number = 0; i < allPlaceholders.length; i++) {
					var ph = allPlaceholders[i];
					ph.parentNode.removeChild(ph);
				}
				sticky.placeholder = null;
			};

			scope.mutationObserver.disconnect();

			sticky.stuck = stuck;
			if (stuck) {
				removePlaceholder();
				this.injectPlaceholder(sticky);
				this.stickIt(sticky, scope.wrapperEl);
			}
			else {
				removePlaceholder();
				this.unstickIt(sticky);
			}

			scope.mutationObserver.observe(scope.el, scope.observes);

		}

		injectPlaceholder(sticky: StickyElement): void {
			if (!sticky.usePlaceholder)
				return;

			sticky.placeholder = document.createElement("div");
			sticky.placeholder.classList.add("stuck-placeholder");
			sticky.placeholder.style.height = sticky.height + "px";

			sticky.element.parentNode.insertBefore(sticky.placeholder, sticky.element);
		}

		stickIt(sticky: StickyElement, container: HTMLElement): void {
			sticky.element.classList.add("stuck");

			if (!sticky.positionSelf)
				return;

			var offset: Offset = this.offsetFactory.getOffset(container);
			var stuff: Offset = this.offsetFactory.getElementCrap(sticky.element);

			
			sticky.element.style.position = "fixed";
			sticky.element.style.left = offset.left + "px";
			sticky.element.style.top = offset.top + "px";
			sticky.element.style.width = (sticky.width - stuff.left) + "px";
		}

		unstickIt(sticky: StickyElement): void {
			sticky.element.classList.remove("stuck");

			if (!sticky.positionSelf)
				return;

			sticky.element.style.position = "";
			sticky.element.style.left = "";
			sticky.element.style.top = "";
			sticky.element.style.width = "";
		}
	}
} 