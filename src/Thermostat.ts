import { IHeater } from './device/IHeater';
import { IThermostatService } from './service/IThermostatService';
import { ITemperatureSource } from './source/ITemperatureSource';
import Debug from 'debug';

export class Thermostat {

	private debug: Debug.Debugger;

	constructor(
		name: string,
		private service: IThermostatService,
		private tempSource: ITemperatureSource,
		private heater: IHeater,
	) {
		this.debug = Debug('HomeAutomationHub:Thermostat:' + name);
		this.init();
	}

	private async refreshState() {
		const currentTemp = this.service.getCurrentTemp();
		const targetTemp = this.service.getTargetTemp();

		if (currentTemp < targetTemp) {
			this.debug(`current temperature (${currentTemp}) lower than target temperature (${targetTemp}), turning heater ON`);
			try {
				await this.heater.setOn();
			} catch (error) {
				this.debug('failed setting heater on', error);
			}
		} else {
			this.debug(`current temperature (${currentTemp}) lower than target temperature (${targetTemp}), turning heater OFF`);
			try {
				await this.heater.setOff();
			} catch (error) {
				this.debug('failed setting heater off', error);
			}
		}
	}

	private init() {
		this.tempSource.onTemperature((temp: number) => {
			this.service.setCurrentTemp(temp);
			this.refreshState();
		});

		this.service.onTargetTempChange(() => this.refreshState());

		setInterval(() => this.refreshState(), 5 * 60e3); // every 5 mins
	}
}
