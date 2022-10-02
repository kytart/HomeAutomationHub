import * as hap from "hap-nodejs";
import Debug from 'debug';
import {
	AppleHomekitHumiditySensor as AppleHomekitHumiditySensorConfig,
	HumiditySensor as HumiditySensorConfig,
	isAppleHomekitHumiditySensor,
} from '../../config/sensor/humiditySensor';
import { Accessory } from '../../homekit/accessory/Accessory';
import { Bridge } from '../../homekit/Bridge';
import { HumiditySensorService } from '../../homekit/service/HumiditySensorService';
import { SensorFactory } from '../sensorFactory';
import { AppleHomekitHumiditySensor } from "./AppleHomekitHumiditySensor";

const debug = Debug('HomeAutomationHub:HumiditySensorFactory');

export class HumiditySensorFactory {

	constructor(
		private appleHomekitBridge: Bridge,
		private sensorFactory: SensorFactory,
	) { }

	public createHumiditySensor(config: HumiditySensorConfig) {
		if (isAppleHomekitHumiditySensor(config)) {
			debug('create Apple Homekit humidity sensor', config);
			return this.createAppleHomekitHumiditySensor(config);
		} else {
			throw new Error(`invalid humidity sensor config ${JSON.stringify(config)}`);
		}
	}

	private createAppleHomekitHumiditySensor(config: AppleHomekitHumiditySensorConfig) {
		const service = new HumiditySensorService(config.name);
		const sensor = this.sensorFactory.createSensor(config.sensor);

		const accessory = new Accessory(config.name, hap.Categories.SENSOR);
		accessory.addService(service);
		this.appleHomekitBridge.addAccessory(accessory);

		return new AppleHomekitHumiditySensor(service, sensor);
	}
}
