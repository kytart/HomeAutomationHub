import { Control } from 'magic-home';
import { RGBColor } from '../color/color';
import { DeviceType } from '../device/IDevice';
import { createDebug } from '../debug/debug';
import { ILight } from "./ILight";

const debug = createDebug('MagicHomeLight');

const controlOptions = {
	ack: {
		power: true,
		color: false,
		pattern: true,
		custom_pattern: true,
	}
}

export class MagicHomeLight implements ILight {

	private control: Control;
	private color: RGBColor | null = null;
	private brightness: number = 100;

	constructor(ip: string) {
		this.control = new Control(ip, controlOptions);
	}

	public getType(): DeviceType {
		return DeviceType.Light;
	}

	public async turnOn(): Promise<void> {
		debug('turn on');
		await this.control.setPower(true);
	}

	public async turnOff(): Promise<void> {
		debug('turn off');
		await this.control.setPower(false);
	}

	public async isOn(): Promise<boolean> {
		const { on } = await this.control.queryState();
		return on;
	}

	public async getColor(): Promise<RGBColor> {
		if (this.color) {
			return this.color;
		}

		const { color } = await this.control.queryState();
		return color;
	}

	public async setColor(color: RGBColor): Promise<void> {
		debug('set color', color);
		await this.control.setColorWithBrightness(color.red, color.green, color.blue, this.brightness);
		this.color = color;
	}

	public async getBrightness(): Promise<number> {
		return this.brightness;
	}

	public async setBrightness(brightness: number): Promise<void> {
		const color = await this.getColor();
		await this.control.setColorWithBrightness(color.red, color.green, color.blue, brightness);
		this.brightness = brightness;
	}
}
