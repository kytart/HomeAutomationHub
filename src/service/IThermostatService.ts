import { IService } from "./IService";

export interface IThermostatService extends IService {
	getCurrentTemp(): number;
	setCurrentTemp(temp: number): void;
	getTargetTemp(): number;
	setTargetTemp(temp: number): void;
	onTargetTempChange(callback: () => void): void;
}
