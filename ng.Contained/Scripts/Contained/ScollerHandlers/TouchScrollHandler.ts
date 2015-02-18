/// <reference path="../reference.ts" />
module Contained {

    export interface TouchPoint
    {
        x: number;
        y: number;
    }

    export class TouchScrollHandler implements IScrollHandler {

        private _eventName: string;
        private _elem: HTMLElement;
        private _$window: ng.IWindowService;
        private _setPositionCallback: SetPositionEvent;

        private _onTouchStartBound: any;
        private _onTouchEndBound: any;
        private _onTouchCancelBound: any;
        private _onTouchLeaveBound: any;
        private _onTouchMoveBound: any;

        // Touch details
        protected _touchPreviousPoint: TouchPoint = <TouchPoint>{};
        protected _currentDelta: number;

        constructor(elem: HTMLElement, $window: ng.IWindowService, setPositionCallback: SetPositionEvent) {
            this._elem = elem;
            this._$window = $window;
            this._setPositionCallback = setPositionCallback;

            this._onTouchStartBound = this.onTouchStart.bind(this);
            this._onTouchEndBound = this.onTouchEnd.bind(this);
            this._onTouchCancelBound = this.onTouchCancel.bind(this);
            this._onTouchLeaveBound = this.onTouchLeave.bind(this);
            this._onTouchMoveBound = this.onTouchMove.bind(this);

            elem.addEventListener("touchstart", this._onTouchStartBound);
            elem.addEventListener("touchend", this._onTouchEndBound);
            elem.addEventListener("touchcancel", this._onTouchCancelBound);
            elem.addEventListener("touchleave", this._onTouchLeaveBound);
            elem.addEventListener("touchmove", this._onTouchMoveBound);
        }

        destroy(): void {
            this._elem.removeEventListener("touchstart", this._onTouchStartBound);
            this._elem.removeEventListener("touchend", this._onTouchEndBound);
            this._elem.removeEventListener("touchcancel", this._onTouchCancelBound);
            this._elem.removeEventListener("touchleave", this._onTouchLeaveBound);
            this._elem.removeEventListener("touchmove", this._onTouchMoveBound);

        }

        onTouchStart(evt: TouchEvent): void {
            evt.stopPropagation();


            this._touchPreviousPoint.y = evt.changedTouches[0].screenY;

        }

        onTouchEnd(evt: TouchEvent, move: boolean = true): void {
            evt.stopPropagation();

            this.calculateDelta(evt.changedTouches[0].screenY);
            if(move) {
                this.moveElement();
            }

        }

        onTouchCancel(evt: TouchEvent): void {
            evt.stopPropagation();
            // not sure if anything needed to happen here
        }

        onTouchLeave(evt: TouchEvent): void {
            evt.stopPropagation();
            // not sure if anything needed to happen here
        }

        onTouchMove(evt: TouchEvent, move: boolean = true): void {
            evt.stopPropagation();
            evt.preventDefault();

            this.calculateDelta(evt.changedTouches[0].screenY);
            if(move) {
                this.moveElement();
            }

        }

        calculateDelta(y):void {
            if( this._touchPreviousPoint.y) {
                this._currentDelta = this._touchPreviousPoint.y - y;
            }
            this._touchPreviousPoint.y = y;
        }

        moveElement():void {
            this._setPositionCallback({ relative: -this._currentDelta });
        }
    }
} 