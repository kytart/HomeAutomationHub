import { DeviceType } from "../device/IDevice";
import { ISensorStorage } from "../storage/ISensorStorage";
import { ISensor } from "./ISensor";

export class PersistentSensor<T> implements ISensor<T> {

	constructor(
		private sensor: ISensor<T>,
		private storage: ISensorStorage<T>,
	) {
		this.init();
	}

	public getType(): DeviceType {
		return DeviceType.Sensor;
	}

	public getCurrent(): T {
		return this.sensor.getCurrent();
	}

	public onData(callback: (data: T) => void): void {
		this.sensor.onData(callback);
	}

	private init() {
		this.sensor.onData((data: T) => this.storage.storeReading(data));
	}
}
