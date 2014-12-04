module Contained {
	export interface IContainedPlugin {
		destroy(): void;
		test(scope: IContainedELScope, compensation: number): void;
		updatePositionInformation(scope: IContainedELScope): void;
		getTopCompensation(scope: IContainedELScope): number;
	}
}  