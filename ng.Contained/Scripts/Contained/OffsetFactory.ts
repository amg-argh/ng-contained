/// <reference path="reference.ts" />
module Contained {
	export class Offset {
		top: number;
		left: number;
	}
	export class OffsetFactory{
		static serviceId = "containedOffsetFactory";

		constructor() {

		}

		getOffset(elem: HTMLElement): Offset {
			var result: Offset = { left: 0, top: 0 };

			if (elem) {
				do {
					result.top += elem.offsetTop;
					result.left += elem.offsetLeft;
					elem = <HTMLElement>elem.offsetParent;
				} while (elem);
			}
			return result;
		}

		getAbsoluteOffset(elem: HTMLElement): Offset {
			var bodyRect: ClientRect = document.body.getBoundingClientRect();
			var elemRect: ClientRect = elem.getBoundingClientRect();

			return {
				left: bodyRect.left + elemRect.left,
				top: bodyRect.top + elemRect.top
			}			
		}

		getElementCrap(elem: HTMLElement): Offset {
			var dropUnit = (value) => {
				return parseInt(value.replace(/[^-\d\.]/g, ''));
			};
			var style: CSSStyleDeclaration = window.getComputedStyle(elem);

			var hoz = dropUnit(style.borderLeftWidth) + dropUnit(style.borderRightWidth) +
				dropUnit(style.paddingLeft) + dropUnit(style.paddingRight) +
				dropUnit(style.marginLeft) + dropUnit(style.marginRight);

			var vert = dropUnit(style.borderTopWidth) + dropUnit(style.borderBottomWidth) +
				dropUnit(style.paddingTop) + dropUnit(style.paddingBottom) +
				dropUnit(style.marginTop) + dropUnit(style.marginBottom);

			return {
				left: hoz,
				top: vert
			};

		}
	}
}

contained.factory(Contained.OffsetFactory.serviceId, [
	() => new Contained.OffsetFactory()
]);