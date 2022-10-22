import { EventEmitter } from 'events';
import * as mqtt from 'async-mqtt';
import { MqttSensor as MqttSensorConfig } from '../config/sensor/sensor';
import { ISensor } from './ISensor';
import { isMqttSensorDataFormatJSON } from '../config/sensor/mqttSensorDataFormat';
import { DeviceType } from '../device/IDevice';
import { createDebug } from '../debug/debug';

const debug = createDebug('MqttSensor');

enum Events {
	DATA = 'data',
}

export class MqttSensor<T> implements ISensor<T> {

	private value: T;
	private emitter: EventEmitter = new EventEmitter();

	constructor(
		private client: mqtt.AsyncClient,
		private config: MqttSensorConfig,
		defaultValue: T,
	) {
		this.value = defaultValue;
		this.init();
	}

	public getCurrent(): T {
		return this.value;
	}

	public getType() {
		return DeviceType.Sensor;
	}

	public onData(callback: (temp: T) => void): void {
		this.emitter.on(Events.DATA, callback);
	}

	private init() {
		this.client.subscribe(this.config.topic).catch((error) => {
			console.error(`failed to subscribe MQTT topic "${this.config.topic}"`, error);
		});

		this.client.on('message', (topic: string, payload: Buffer) => {
			if (topic === this.config.topic) {
				const message = payload.toString();

				try {
					const value = this.parsePayload(payload.toString());
					debug(`got value`, { topic, value, payload: message });
					this.value = value;
					this.emitter.emit(Events.DATA, value);
				} catch (error) {
					console.error('error while parsing MQTT payload', { topic, payload: message, error: error.message });
				}
			}
		});
	}

	private parsePayload(payload: string): T {
		if (isMqttSensorDataFormatJSON(this.config.format)) {
			return this.parseJSONPayload(payload, this.config.format.path);
		} else {
			console.error('invalid MQTT sensor data format');
		}
	}

	private parseJSONPayload(payload: string, path: string) {
		const pathParts = path.split('.');

		let current = JSON.parse(payload);
		while (pathParts.length > 0) {
			const nextKey = pathParts.shift();
			current = current[nextKey];
		}

		return current;
	}
}
