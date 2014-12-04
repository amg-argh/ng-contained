module Contained {
	export interface IContainedPlugin {
		destroy(): void;
		test(scope: IContainedELScope) : void;
		updatePositionInformation(scope: IContainedELScope): void;
	}
}  