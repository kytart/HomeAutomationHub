import { hsl2rgb, HSLColor, rgb2hsl, RGBColor } from "../color/color";
import { DeviceType } from "../device/IDevice";
import { ILightService } from "../homekit/service/ILightService";
import { createDebug } from '../debug/debug';
import { ILight } from "./ILight";

const debug = createDebug('AppleHomekitLight');

export class AppleHomekitLight implements ILight {

	constructor(
		private service: ILightService,
		private device: ILight,
	) {
		this.init();
	}

	public getType(): DeviceType {
		return DeviceType.Light;
	}

	public async turnOn(): Promise<void> {
		debug('turn on');
		this.service.turnOn();
		await this.device.turnOn();
	}

	public async turnOff(): Promise<void> {
		debug('turn off');
		this.service.turnOff();
		await this.device.turnOff();
	}

	public isOn(): Promise<boolean> {
		return this.device.isOn();
	}

	public getColor(): Promise<RGBColor> {
		return this.device.getColor();
	}

	public async setColor(color: RGBColor): Promise<void> {
		debug('set color', color);
		this.service.setColor(rgb2hsl(color));
		await this.device.setColor(color);
	}

	public getBrightness(): Promise<number> {
		return this.device.getBrightness();
	}

	public async setBrightness(brightness: number): Promise<void> {
		debug('set brightness');
		this.service.setBrightness(brightness);
		await this.device.setBrightness(brightness);
	}

	private init() {
		this.syncDeviceToService();
		this.service.onPowerChange(this.handlePowerChange.bind(this));
		this.service.onColorChange(this.handleColorChange.bind(this));
		this.service.onBrightnessChange(this.handleBrightnessChange.bind(this));
	}

	private syncDeviceToService() {
		this.device.isOn().then((on) => {
			if (on) {
				this.service.turnOn();
			} else {
				this.service.turnOff();
			}
		});

		this.device.getColor().then((color) => {
			this.service.setColor(rgb2hsl(color));
		});

		this.device.getBrightness().then((brightness) => {
			this.service.setBrightness(brightness);
		});
	}

	private handlePowerChange(on: boolean) {
		debug('power change', on);
		if (on) {
			this.device.turnOn();
		} else {
			this.device.turnOff();
		}
	}

	private handleColorChange(hsl: HSLColor) {
		debug('color change', hsl);
		const rgb = hsl2rgb(hsl);
		this.device.setColor(rgb);
	}

	private handleBrightnessChange(brightness: number) {
		debug('brightness change', brightness);
		this.device.setBrightness(brightness);
	}
}
