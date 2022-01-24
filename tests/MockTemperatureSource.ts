import { EventEmitter } from 'events';
import { ITemperatureSource } from '../src/source/ITemperatureSource';

enum Events {
	Temperature = 'temperature',
}

export class MockTemperatureSource implements ITemperatureSource {

	private emitter: EventEmitter = new EventEmitter();

	public emitTemperature(temp: number) {
		this.emitter.emit(Events.Temperature, temp);
	}

	public onTemperature(callback: (temp: number) => void): void {
		this.emitter.on(Events.Temperature, callback);
	}
}
