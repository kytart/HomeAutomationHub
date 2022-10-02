import { EventEmitter } from 'events';
import * as mqtt from 'async-mqtt';
import Debug from 'debug';
import { MqttSensor as MqttSensorConfig } from '../config/sensor/sensor';
import { ISensor } from './ISensor';
import { isMqttSensorDataFormatJSON, isMqttSensorDataFormatNumber } from '../config/sensor/mqttSensorDataFormat';
import { DeviceType } from '../device/IDevice';

const debug = Debug('HomeAutomationHub:MqttSensor');

enum Events {
	DATA = 'data',
}

const DEFAULT_VALUE = 0;

export class MqttSensor implements ISensor {

	private value: number = DEFAULT_VALUE;
	private emitter: EventEmitter = new EventEmitter();

	constructor(
		private client: mqtt.AsyncClient,
		private config: MqttSensorConfig,
	) {
		this.init();
	}

	public getCurrent(): number {
		return this.value;
	}

	public getType() {
		return DeviceType.Sensor;
	}

	public onData(callback: (temp: number) => void): void {
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

	private parsePayload(payload: string): number {
		if (isMqttSensorDataFormatNumber(this.config.format)) {
			return this.parseNumberPayload(payload);
		} else if (isMqttSensorDataFormatJSON(this.config.format)) {
			return this.parseJSONPayload(payload, this.config.format.path);
		} else {
			console.error('invalid MQTT sensor data format');
		}
	}

	private parseNumberPayload(payload: string) {
		return Number(payload);
	}

	private parseJSONPayload(payload: string, path: string) {
		const pathParts = path.split('.');

		let current = JSON.parse(payload);
		while (pathParts.length > 0) {
			const nextKey = pathParts.shift();
			current = current[nextKey];
		}

		if (typeof (current) !== 'number') {
			throw new Error(`Value ${current} at path ${path} isn't a number`);
		}

		return current;
	}
}
