module Contained {

	export interface WaypointElement {
		element: HTMLElement;
		start: number;
		end: number;
		inView: boolean;
		param: string;
	}

	export class Waypoint implements IContainedPlugin {

		private _currentlyActive: WaypointElement = null;
		private _container: HTMLElement;
		private _offsetFactory: OffsetFactory;
		private _waypoints: WaypointElement[];

		constructor(container: HTMLElement, offsetFactory: OffsetFactory) {
			this._offsetFactory = offsetFactory;
			this._container = container;
			this.updatePositionInformation();
		}

		updatePositionInformation(): void {
			this._waypoints = [];
			var waypoints: NodeList = this._container.querySelectorAll("[waypoint]");
			if (waypoints.length === 0)
				return;

			for (var i: number = 0; i < waypoints.length; i++) {
				var el: HTMLElement = <HTMLElement>waypoints[i]
				var offset: Offset = this._offsetFactory.getOffset(el);

				this._waypoints.push({
					element: el,
					start: offset.top,
					end: offset.top + el.clientHeight,
					inView: false,
					param: el.getAttribute("waypoint")
				});
			}
		}

		destroy(): void {

		}

		test(scope: IContainedELScope): void {
			var offset: number = Math.abs(scope.position);
			var boundsStart: number = offset;
			var boundsEnd: number = boundsStart + scope.wrapperHeight;
			var boundsEndHalf: number = boundsStart + (scope.wrapperHeight / 2);

			this._waypoints.forEach((waypoint: WaypointElement) => {
				waypoint.inView = this.intersects(boundsStart, boundsEnd, waypoint.start, waypoint.end);
			});

			var inView: WaypointElement[] = this._waypoints.filter((waypoint: WaypointElement) => {
				return waypoint.inView;
			});

			if (inView.length === 0) {
				return;
			}

			var mostActive: WaypointElement = inView[0];
			for (var i: number = inView.length - 1; i >= 0; i--) {
				var waypoint: WaypointElement = inView[i];

				var startInHalfView: boolean = (waypoint.start >= boundsStart) && (waypoint.start <= boundsEndHalf);
				if (startInHalfView) {
					mostActive = waypoint;
					break;
				}
			}

			if (mostActive !== this._currentlyActive) {
				this._currentlyActive = mostActive;

				scope.$broadcast("waypoint", mostActive.param);
				scope.$emit("waypoint", mostActive.param);

			}


		}

		intersects(containerTop: number, containerBottom: number, testTop: number, testBottom: number): boolean {
			if (testTop <= containerTop && testBottom >= containerTop)
				return true;

			if (testTop >= containerTop && testTop <= containerBottom)
				return true;

			return false;
		}

	}
}