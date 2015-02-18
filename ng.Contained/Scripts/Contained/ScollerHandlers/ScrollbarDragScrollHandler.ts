/// <reference path="../reference.ts" />
module Contained {
	export class ScrollbarDragScrollHandler implements IScrollHandler {


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
			var startY: number = evt.pageY;

			var mouseMove = (e: MouseEvent) => {
				var nowY: number = e.pageY;
				var delta: number = startY - nowY;
				startY = nowY;

				this._setPositionCallback({ relativeToBeRatio: delta });
			};

			var mouseUp = (e: MouseEvent) => {
				this._$window.removeEventListener("mousemove", mouseMove);
				this._$window.removeEventListener("mouseup", mouseUp);
			}

			this._$window.addEventListener("mousemove", mouseMove);
			this._$window.addEventListener("mouseup", mouseUp);

			evt.preventDefault();
			evt.stopPropagation(); //<-- stop it propagaing to the scrollbar track and firing the ScrollbarClickScrollHandler
		}


	}
} 