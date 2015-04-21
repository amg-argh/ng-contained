module Contained {

	export interface WaypointElement {
		element: HTMLElement;
		start: number;
		height: number;
		inView: boolean;
		param: string;

	}


	export class Waypoint implements IContainedPlugin {

		private _currentlyActive: WaypointElement = null;
		private _container: HTMLElement;
		private _offsetFactory: OffsetFactory;
		private _waypoints: WaypointElement[];

		constructor(container: HTMLElement, offsetFactory: OffsetFactory, scope:IContainedELScope) {
			this._offsetFactory = offsetFactory;
			this._container = container;
			this.updatePositionInformation(scope);
		}

		updatePositionInformation(scope: IContainedELScope): void {
			this._waypoints = [];
			var waypoints: NodeList = this._container.querySelectorAll("[waypoint]");
			if (waypoints.length === 0)
				return;

			for (var i: number = 0; i < waypoints.length; i++) {
				var el: HTMLElement = <HTMLElement>waypoints[i]
				var offset: Offset = this._offsetFactory.getOffset(el);

				this._waypoints.push({
					element: el,
					start: offset.top - scope.position,
					height: el.clientHeight,
					inView: false,
					param: el.getAttribute("waypoint")
				});
			}
		}

		getTopCompensation(scope: IContainedELScope): number {
			return 0;
		}

		destroy(): void {

		}

		test(scope: IContainedELScope, compensation: number): void {
			
			var offset: number = Math.abs(scope.position);

			var quarter: number = scope.wrapperHeight / 4;
			var upperQuarter: number = offset + quarter + compensation;

			var mostActive: WaypointElement = null;

			for (var i: number = 0; i < this._waypoints.length; i++) {
				var waypoint: WaypointElement = this._waypoints[i];
				waypoint.inView = (i == 0) || (waypoint.start <= upperQuarter);
			}

			for (var i: number = this._waypoints.length - 1; i >= 0; i--) {
				var waypoint: WaypointElement = this._waypoints[i];
				if (waypoint.inView) {
					mostActive = waypoint;
					break;
				}
			}
			
			if (mostActive !== null && mostActive !== this._currentlyActive) {
				this._currentlyActive = mostActive;

				scope.$broadcast("waypoint", mostActive.param);
				scope.$emit("waypoint", mostActive.param);
			}


		}

	}
}