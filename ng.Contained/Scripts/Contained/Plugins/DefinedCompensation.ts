module Contained {
	export class DefinedCompensation implements IContainedPlugin {
		public destroy(): void { }
		public test(scope: IContainedELScope, compensation: number): void { }
		public updatePositionInformation(scope: IContainedELScope): void { }

		private _compensateBy: number = 0;
		
		constructor(attrs: ng.IAttributes) {
			if (attrs["topCompensation"]) {
				this._compensateBy = parseInt(attrs["topCompensation"]);
			}
		}


		public getTopCompensation(scope: IContainedELScope): number {
			return this._compensateBy;
		}
	}
}