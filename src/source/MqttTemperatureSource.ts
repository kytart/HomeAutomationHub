import { EventEmitter } from 'events';
import * as mqtt from 'async-mqtt';
import Debug from 'debug';
import { ITemperatureSource } from './ITemperatureSource';

const debug = Debug('HomeAutomationHub:MqttTemperatureSource');

enum Events {
	TEMPERATURE = 'temperature',
}

export class MqttTemperatureSource implements ITemperatureSource {

	private emitter: EventEmitter = new EventEmitter();

	constructor(
		private client: mqtt.AsyncClient,
		private topic: string,
	) {
		this.init();
	}

	public onTemperature(callback: (temp: number) => void): void {
		this.emitter.on(Events.TEMPERATURE, callback);
	}

	private init() {
		this.client.on('message', (topic: string, payload: Buffer) => {
			if (topic === this.topic) {
				const message = payload.toString();
				const temp = Number(message);
				debug(`got temperature - temp=${temp}, topic=${topic}, message=${message}`);
				this.emitter.emit(Events.TEMPERATURE, temp);
			}
		});
	}
}
