import { DeviceType } from "../../device/IDevice";
import { IWindowSensorService } from "../../homekit/service/IWindowSensorService";
import { ISensor } from "../ISensor";

export class AppleHomekitWindowSensor implements ISensor<boolean> {

	constructor(
		private service: IWindowSensorService,
		private sensor: ISensor<boolean>,
	) {
		this.init();
	}

	public getCurrent(): boolean {
		return this.sensor.getCurrent();
	}

	public onData(callback: (data: boolean) => void): void {
		this.sensor.onData(callback);
	}

	public getType(): DeviceType {
		return DeviceType.WindowSensor;
	}

	private init() {
		this.sensor.onData((isClosed: boolean) => {
			this.service.setOpen(!isClosed);
		});
	}
}
