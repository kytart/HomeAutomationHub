import * as hap from 'hap-nodejs';
import { Characteristic } from './Characteristic';
import { IHumiditySensorService } from './IHumiditySensorService';

const DEFAULT_CURRENT_HUMIDITY = 100;

export class HumiditySensorService implements IHumiditySensorService {

	private service: hap.Service;

	private currentValue: Characteristic<number>;

	constructor(name: string) {
		this.service = new hap.Service.HumiditySensor(name);
		this.currentValue = new Characteristic(this.service, hap.Characteristic.CurrentRelativeHumidity, DEFAULT_CURRENT_HUMIDITY);
	}

	public getService(): hap.Service {
		return this.service;
	}

	public getValue(): number {
		return this.currentValue.getValue();
	}

	public setValue(value: number): void {
		this.currentValue.setValue(value);
	}

	public onChange(callback: (value: number) => void): void {
		this.currentValue.onChange(callback);
	}
}
