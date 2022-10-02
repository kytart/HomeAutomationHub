import * as hap from "hap-nodejs";
import Debug from 'debug';
import {
	AppleHomekitWindowSensor as AppleHomekitWindowSensorConfig,
	WindowSensor as WindowSensorConfig,
	isAppleHomekitWindowSensor,
} from '../../config/sensor/windowSensor';
import { Accessory } from '../../homekit/accessory/Accessory';
import { Bridge } from '../../homekit/Bridge';
import { SensorFactory } from '../SensorFactory';
import { WindowSensorService } from "../../homekit/service/WindowSensorService";
import { AppleHomekitWindowSensor } from "./AppleHomekitWindowSensor";

const debug = Debug('HomeAutomationHub:WindowSensorFactory');

export class WindowSensorFactory {

	constructor(
		private appleHomekitBridge: Bridge,
		private sensorFactory: SensorFactory,
	) { }

	public createWindowSensor(config: WindowSensorConfig) {
		if (isAppleHomekitWindowSensor(config)) {
			debug('create Apple Homekit window sensor', config);
			return this.createAppleHomekitWindowSensor(config);
		} else {
			throw new Error(`invalid window sensor config ${JSON.stringify(config)}`);
		}
	}

	private createAppleHomekitWindowSensor(config: AppleHomekitWindowSensorConfig) {
		const service = new WindowSensorService(config.name);
		const sensor = this.sensorFactory.createSensor(config.sensor, true);

		const accessory = new Accessory(config.name, hap.Categories.WINDOW);
		accessory.addService(service);
		this.appleHomekitBridge.addAccessory(accessory);

		return new AppleHomekitWindowSensor(service, sensor);
	}
}
