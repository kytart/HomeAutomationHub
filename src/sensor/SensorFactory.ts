import * as mqtt from 'async-mqtt';
import Debug from 'debug';
import { Persistance as PersistanceConfig } from '../config/sensor/persistance';
import { isMqttSensor, Sensor as SensorConfig } from '../config/sensor/sensor';
import { StorageFactory } from '../storage/StorageFactory';
import { ISensor } from './ISensor';
import { MqttSensor } from './MqttSensor';
import { PersistentSensor } from './PersistentSensor';

const debug = Debug('HomeAutomationHub:SensorFactory');

export class SensorFactory {

	constructor(
		private mqttClient: mqtt.AsyncClient,
		private storageFactory: StorageFactory,
	) { }

	public createSensor(config: SensorConfig): ISensor {
		const baseSensor = this.createBaseSensor(config);
		if (config.persistance) {
			return this.createPersistedSensor(baseSensor, config.persistance);
		}
		return baseSensor;
	}

	private createBaseSensor(config: SensorConfig): ISensor {
		if (isMqttSensor(config)) {
			debug('create MQTT sensor', config);
			return new MqttSensor(this.mqttClient, config);
		} else {
			throw new Error(`invalid sensor config ${JSON.stringify(config)}`);
		}
	}

	private createPersistedSensor(baseSensor: ISensor, config: PersistanceConfig) {
		const storage = this.storageFactory.createSensorStorage(config);
		return new PersistentSensor(baseSensor, storage);
	}
}
