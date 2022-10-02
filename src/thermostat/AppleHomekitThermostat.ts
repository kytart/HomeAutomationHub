import Debug from 'debug';
import { IThermostatService } from '../homekit/service/IThermostatService';
import { ISensor } from '../sensor/ISensor';
import { IOnOffDevice } from '../onOffDevice/IOnOffDevice';
import { IThermostat } from './IThermostat';
import { DeviceType } from '../device/IDevice';

const debug = Debug('HomeAutomationHub:SoftwareThermostat');

export class AppleHomekitThermostat implements IThermostat {

	constructor(
		private service: IThermostatService,
		private tempSensor: ISensor,
		private heater: IOnOffDevice,
	) {
		this.init();
	}

	public getCurrentTemp(): number {
		return this.service.getCurrentTemp();
	}

	public setCurrentTemp(temp: number): void {
		return this.service.setCurrentTemp(temp);
	}

	public getTargetTemp(): number {
		return this.service.getTargetTemp();
	}

	public setTargetTemp(temp: number): void {
		this.service.setTargetTemp(temp);
	}

	public onCurrentTempChange(callback: (temp: number) => void): void {
		return this.tempSensor.onData(callback);
	}

	public onTargetTempChange(callback: (temp: number) => void): void {
		this.service.onTargetTempChange(callback);
	}

	public getType(): DeviceType {
		throw new Error('Method not implemented.');
	}

	private async refreshState() {
		const currentTemp = this.service.getCurrentTemp();
		const targetTemp = this.service.getTargetTemp();

		if (currentTemp < targetTemp) {
			debug(`current temperature (${currentTemp}) lower than target temperature (${targetTemp}), turning heater ON`);
			try {
				await this.heater.setOn();
			} catch (error) {
				debug('failed setting heater on', error);
			}
		} else {
			debug(`current temperature (${currentTemp}) lower than target temperature (${targetTemp}), turning heater OFF`);
			try {
				await this.heater.setOff();
			} catch (error) {
				debug('failed setting heater off', error);
			}
		}
	}

	private init() {
		this.tempSensor.onData((temp: number) => {
			this.service.setCurrentTemp(temp);
			this.refreshState();
		});

		this.service.onTargetTempChange(() => this.refreshState());

		setInterval(() => this.refreshState(), 5 * 60e3); // every 5 mins
	}
}
