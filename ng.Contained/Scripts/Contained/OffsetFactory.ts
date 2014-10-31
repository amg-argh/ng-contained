module Contained {
	export class Offset {
		top: number;
		left: number;
	}
	export class OffsetFactory{
		static serviceId = "offsetFactory";

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
	}
}

contained.factory(Contained.OffsetFactory.serviceId, [
	() => new Contained.OffsetFactory()
]);