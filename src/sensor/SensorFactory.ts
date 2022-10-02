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

	public createSensor<T>(config: SensorConfig, defaultValue: T): ISensor<T> {
		const baseSensor = this.createBaseSensor<T>(config, defaultValue);
		if (config.persistance) {
			return this.createPersistedSensor<T>(baseSensor, config.persistance);
		}
		return baseSensor;
	}

	private createBaseSensor<T>(config: SensorConfig, defaultValue: T): ISensor<T> {
		if (isMqttSensor(config)) {
			debug('create MQTT sensor', config);
			return new MqttSensor<T>(this.mqttClient, config, defaultValue);
		} else {
			throw new Error(`invalid sensor config ${JSON.stringify(config)}`);
		}
	}

	private createPersistedSensor<T>(baseSensor: ISensor<T>, config: PersistanceConfig) {
		const storage = this.storageFactory.createSensorStorage<T>(config);
		return new PersistentSensor<T>(baseSensor, storage);
	}
}
