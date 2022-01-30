import * as hap from 'hap-nodejs';
import { IThermostatService } from './IThermostatService';
import { Characteristic } from './Characteristic';

const DEFAULT_CURRENT_TEMP = 10;
const DEFAULT_TARGET_TEMP = 10;

enum TargetHeatingCoolingState {
	OFF = 0,
	HEAT = 1,
	COOL = 2,
	AUTO = 3,
}

export class ThermostatService implements IThermostatService {

	private service: hap.Service;

	private currentTemp: Characteristic<number>;
	private targetTemp: Characteristic<number>;
	private targetCoolingHeatingState: Characteristic<TargetHeatingCoolingState>;

	constructor(name: string) {
		this.service = new hap.Service.Thermostat(name);
		this.currentTemp = new Characteristic(this.service, hap.Characteristic.CurrentTemperature, DEFAULT_CURRENT_TEMP);
		this.targetTemp = new Characteristic(this.service, hap.Characteristic.TargetTemperature, DEFAULT_TARGET_TEMP);
		this.targetCoolingHeatingState = new Characteristic(
			this.service,
			hap.Characteristic.TargetHeatingCoolingState,
			TargetHeatingCoolingState.OFF,
		);

		this.init();
	}

	public getService(): hap.Service {
		return this.service;
	}

	public getCurrentTemp() {
		return this.currentTemp.getValue();
	}

	public setCurrentTemp(temp: number) {
		this.currentTemp.setValue(temp);
	}

	public getTargetTemp() {
		return this.targetTemp.getValue();
	}

	public onTargetTempChange(callback: () => void) {
		this.targetTemp.onChange(callback);
	}

	private init() {
		this.targetCoolingHeatingState.setValue(TargetHeatingCoolingState.AUTO);
	}
}
