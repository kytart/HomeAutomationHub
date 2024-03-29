import { IDevice } from "../device/IDevice";

export interface IThermostat extends IDevice {
	getCurrentTemp(): number;
	setCurrentTemp(temp: number): void;
	getTargetTemp(): number;
	setTargetTemp(temp: number): void;
	onCurrentTempChange(callback: (temp: number) => void): void;
	onTargetTempChange(callback: (temp: number) => void): void;
}
