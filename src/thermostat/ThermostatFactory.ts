import * as hap from "hap-nodejs";
import { Accessory } from '../homekit/accessory/Accessory';
import { Bridge } from "../homekit/Bridge";
import {
	Thermostat as ThermostatConfig,
	AppleHomekitThermostat as AppleHomekitThermostatConfig,
	isAppleHomekitThermostat,
} from '../config/thermostat';
import { OnOffDeviceFactory } from '../onOffDevice/OnOffDeviceFactory';
import { SensorFactory } from '../sensor/SensorFactory';
import { ThermostatService } from '../homekit/service/ThermostatService';
import { AppleHomekitThermostat } from './AppleHomekitThermostat';
import { IThermostat } from './IThermostat';
import { ISensor } from "../sensor/ISensor";
import { createDebug } from "../debug/debug";

const debug = createDebug('ThermostatFactory');

export class ThermostatFactory {

	constructor(
		private appleHomekitBridge: Bridge,
		private sensorFactory: SensorFactory,
		private onOffDeviceFactory: OnOffDeviceFactory,
	) { }

	public createThermostat(config: ThermostatConfig): IThermostat {
		if (isAppleHomekitThermostat(config)) {
			debug('create Apple Homekit thermostat', config);
			return this.createAppleHomekitThermostat(config);
		} else {
			throw new Error(`invalid thermostat config ${JSON.stringify(config)}`);
		}
	}

	private createAppleHomekitThermostat(config: AppleHomekitThermostatConfig) {
		const service = new ThermostatService(config.name);
		const tempSensor = this.sensorFactory.createSensor<number>(config.temperatureSensor, 10);
		const heater = this.onOffDeviceFactory.createOnOffDevice(config.heater.config);

		let windowSensor: ISensor<boolean> | undefined = undefined;
		if (config.windowSensor) {
			windowSensor = this.sensorFactory.createSensor<boolean>(config.windowSensor, false);
		}

		const accessory = new Accessory(config.name, hap.Categories.THERMOSTAT);
		accessory.addService(service);
		this.appleHomekitBridge.addAccessory(accessory);

		return new AppleHomekitThermostat(service, tempSensor, windowSensor, heater);
	}
}
