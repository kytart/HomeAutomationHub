import Debug from 'debug';
import { ISensor } from '../ISensor';
import { DeviceType } from '../../device/IDevice';
import { IHumiditySensorService } from '../../homekit/service/IHumiditySensorService';

const debug = Debug('HomeAutomationHub:AppleHomekitHumiditySensor');

export class AppleHomekitHumiditySensor implements ISensor {

	constructor(
		private service: IHumiditySensorService,
		private sensor: ISensor,
	) {
		this.init();
	}

	public getCurrent(): number {
		return this.sensor.getCurrent();
	}

	public onData(callback: (data: number) => void): void {
		this.sensor.onData(callback);
	}


	public getType(): DeviceType {
		return DeviceType.HumiditySensor;
	}

	private init() {
		this.sensor.onData((value: number) => {
			this.service.setValue(value);
		});
	}
}
