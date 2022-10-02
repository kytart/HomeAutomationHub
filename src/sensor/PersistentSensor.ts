import { DeviceType } from "../device/IDevice";
import { ISensorStorage } from "../storage/ISensorStorage";
import { ISensor } from "./ISensor";

export class PersistentSensor implements ISensor {

	constructor(
		private sensor: ISensor,
		private storage: ISensorStorage,
	) {
		this.init();
	}

	public getType(): DeviceType {
		return DeviceType.Sensor;
	}

	public getCurrent(): number {
		return this.sensor.getCurrent();
	}

	public onData(callback: (data: number) => void): void {
		this.sensor.onData(callback);
	}

	private init() {
		this.sensor.onData((data: number) => this.storage.storeReading(data));
	}
}
