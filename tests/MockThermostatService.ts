import { EventEmitter } from 'events';
import { Service } from 'hap-nodejs';
import { IThermostatService } from '../src/service/IThermostatService';

enum Events {
	TargetTemperatureChange = 'target_temp_change',
}

export class MockThermostatService implements IThermostatService {

	private emitter: EventEmitter = new EventEmitter();

	private currentTemp: number;
	private targetTemp: number;

	public getCurrentTemp(): number {
		return this.currentTemp;
	}

	public setCurrentTemp(temp: number): void {
		this.currentTemp = temp;
	}

	public getTargetTemp(): number {
		return this.targetTemp;
	}

	public setTargetTemp(temp: number): void {
		this.targetTemp = temp;
		this.emitter.emit(Events.TargetTemperatureChange);
	}

	public onTargetTempChange(callback: () => void): void {
		this.emitter.on(Events.TargetTemperatureChange, callback);
	}

	public getService(): Service {
		throw new Error('Method not implemented.');
	}
}
