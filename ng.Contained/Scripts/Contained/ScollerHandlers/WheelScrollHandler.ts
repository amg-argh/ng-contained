module Contained {
	export class WheelScrollHandler implements IScrollHandler {


        private _eventName: string;
		private _elem: HTMLElement;
		private _$window: ng.IWindowService;
		private _setPositionCallback: SetPositionEvent;

		private _onMouseWheelBound: any;


		constructor(elem: HTMLElement, $window: ng.IWindowService, setPositionCallback: SetPositionEvent) {
			this._elem = elem;
			this._$window = $window;
			this._setPositionCallback = setPositionCallback;

			this._eventName = (elem.onmousewheel === undefined) ? 'DOMMouseScroll' : 'mousewheel';
			this._onMouseWheelBound = this.onMouseWheel.bind(this);
			elem.addEventListener(this._eventName, this._onMouseWheelBound);
		}

		destroy(): void {
			this._elem.removeEventListener(this._eventName, this._onMouseWheelBound);
		}

		onMouseWheel(evt: MouseWheelEvent): void {			
			evt.stopPropagation();
			var delta = evt.wheelDelta ? evt.wheelDelta : (evt.detail * -120);
			/////////////////////////////////////////////// FIREFOX     ^^^^

			var finalDelta = delta / 4;
			this._setPositionCallback({ relative: finalDelta });
		}

	}
} 