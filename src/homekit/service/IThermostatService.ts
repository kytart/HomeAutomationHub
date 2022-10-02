import { IService } from "./IService";

export interface IThermostatService extends IService {
	getCurrentTemp(): number;
	setCurrentTemp(temp: number): void;
	getTargetTemp(): number;
	onTargetTempChange(callback: (temp: number) => void): void;
}
