import { IService } from "./IService";

export enum TargetHeatingCoolingState {
	OFF = 0,
	HEAT = 1,
	COOL = 2,
	AUTO = 3,
}

export interface IThermostatService extends IService {
	getCurrentTemp(): number;
	setCurrentTemp(temp: number): void;
	getTargetTemp(): number;
	setTargetTemp(temp: number): void;
	onTargetTempChange(callback: (temp: number) => void): void;
	getState(): TargetHeatingCoolingState;
	onStateChange(callback: (state: TargetHeatingCoolingState) => void): void;
}
