import { EventEmitter } from 'events';
import * as hap from 'hap-nodejs';
import Debug from 'debug';
import { IThermostatService } from './IThermostatService';

const debug = Debug('HomeAutomationHub:ThermostatService');

enum Events {
	TargetTemperatureChange = 'target_temp_change',
}

export class ThermostatService implements IThermostatService {

	private service: hap.Service;
	private emitter: EventEmitter = new EventEmitter();

	private currentTemp = 10;
	private targetTemp = 10;

	constructor(private name: string) {
		this.service = new hap.Service.Thermostat(name);
		this.init();
	}

	getService(): hap.Service {
		return this.service;
	}

	public getCurrentTemp() {
		return this.currentTemp;
	}

	public setCurrentTemp(temp: number) {
		this.currentTemp = temp;
	}

	public getTargetTemp() {
		return this.targetTemp;
	}

	public setTargetTemp(temp: number) {
		this.targetTemp = temp;
	}

	public onTargetTempChange(callback: () => void) {
		this.emitter.on(Events.TargetTemperatureChange, callback);
	}

	private init() {
		const currentTempCharacteristic = this.service.getCharacteristic(hap.Characteristic.CurrentTemperature);
		const targetTempCharacteristic = this.service.getCharacteristic(hap.Characteristic.TargetTemperature);

		currentTempCharacteristic.on(hap.CharacteristicEventTypes.GET, callback => {
			debug('GET current temperature: ' + this.currentTemp);
			callback(undefined, this.currentTemp);
		});
		currentTempCharacteristic.on(hap.CharacteristicEventTypes.SET, (value: number, callback) => {
			debug('SET current temperature to: ' + value);
			this.currentTemp = value;
			callback();
		});

		targetTempCharacteristic.on(hap.CharacteristicEventTypes.GET, callback => {
			debug('GET target temperature: ' + this.targetTemp);
			callback(undefined, this.targetTemp);
		});
		targetTempCharacteristic.on(hap.CharacteristicEventTypes.SET, (value: number, callback) => {
			debug('SET target temperature to: ' + value);
			this.targetTemp = value;
			callback();
			this.emitter.emit(Events.TargetTemperatureChange);
		});
	}
}
