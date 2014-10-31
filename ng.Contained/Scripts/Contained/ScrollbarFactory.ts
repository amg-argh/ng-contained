module Contained {
	export class ScrollbarFactory {
		static serviceId = "containedScrollbarFactory";

		constructor() {

		}

		renderScrollbar(scrollbarHandle: HTMLElement, visibleHeight: number, scrollHeight: number, offset: number): void {
			var visible = visibleHeight < scrollHeight;
			if (!visible) {
				scrollbarHandle.style.display = "none";
				return;
			}
						
			var scrollBarRatio = visibleHeight / scrollHeight;
			var scrollBarSizePx = Math.round(visibleHeight * scrollBarRatio);

			var offsetRatio = Math.abs(offset) / scrollHeight;
			offsetRatio = Math.min(1, offsetRatio);
			var offsetInPx = Math.round(visibleHeight * offsetRatio);

			scrollbarHandle.style.display = "block";
			scrollbarHandle.style.height = scrollBarSizePx + "px";


			//use 3d transformations for positioning the scrollbar
			if (!Modernizr.csstransforms3d) {
				throw "Soz, no current support for browsers with no 3d transformations";
			}

			//Let's cheating for now; chuck it against the css rather than creating a matrix based on the
			//current transformation state. Firefox still doesn't appear to have a MozCSSMatrix; similar
			//to WebKitCSSMatrix and MSCSSMatrix

			var translation = "translate3d(0, " + offsetInPx + "px, 0)";
			scrollbarHandle.style.transform = translation;
		}
	}
}

contained.factory(Contained.ScrollbarFactory.serviceId, [
	() => new Contained.ScrollbarFactory()
]);