module Contained {
	export class ScrollbarClickScrollHandler implements IScrollHandler {


		private _eventName: string;
		private _elem: HTMLElement;
		private _$window: ng.IWindowService;
		private _setPositionCallback: SetPositionEvent;

		private _onMouseDownBound: any;


		constructor(elem: HTMLElement, $window: ng.IWindowService, setPositionCallback: SetPositionEvent) {
			this._elem = elem;
			this._$window = $window;
			this._setPositionCallback = setPositionCallback;

			this._onMouseDownBound = this.onMouseDown.bind(this);
			this._elem.addEventListener("mousedown", this._onMouseDownBound);
		}

		destroy(): void {
			this._elem.removeEventListener("mousedown", this._onMouseDownBound);
		}

		onMouseDown(evt: MouseEvent): void {
			evt.preventDefault();
		}


	}
}  