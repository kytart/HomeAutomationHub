import * as hap from 'hap-nodejs';
import { HSLColor } from '../../color/color';
import { Characteristic } from './Characteristic';
import { ILightService } from './ILightService';

const DEFAULT_POWER = false;
const DEFAULT_BRIGHTNESS = 100;
const DEFAULT_SATURATION = 0;
const DEFAULT_HUE = 0;

export class LightService implements ILightService {

	private service: hap.Service;

	private power: Characteristic<boolean>;
	private brightness: Characteristic<number>;
	private saturation: Characteristic<number>;
	private hue: Characteristic<number>;


	constructor(name: string) {
		this.service = new hap.Service.Lightbulb(name);
		this.power = new Characteristic(this.service, hap.Characteristic.On, DEFAULT_POWER);
		this.brightness = new Characteristic(this.service, hap.Characteristic.Brightness, DEFAULT_BRIGHTNESS);
		this.saturation = new Characteristic(this.service, hap.Characteristic.Saturation, DEFAULT_SATURATION);
		this.hue = new Characteristic(this.service, hap.Characteristic.Hue, DEFAULT_HUE);
	}

	public getService(): hap.Service {
		return this.service;
	}

	public isOn(): boolean {
		return this.power.getValue();
	}

	public turnOn() {
		this.power.setValue(true);
	}

	public turnOff() {
		this.power.setValue(false);
	}

	public getColor(): HSLColor {
		const saturation = this.saturation.getValue();
		const hue = this.hue.getValue();
		return { hue, saturation, lightness: 50 };
	}

	public setColor(color: HSLColor) {
		this.saturation.setValue(color.saturation);
		this.hue.setValue(color.hue);
	}

	public getBrightness(): number {
		return this.brightness.getValue();
	}

	public setBrightness(brightness: number): void {
		this.brightness.setValue(brightness);
	}

	public onPowerChange(callback: (on: boolean) => void) {
		this.power.onChange(callback);
	}

	public onColorChange(callback: (color: HSLColor) => void) {
		const listener = () => {
			const color = this.getColor();
			callback(color);
		};

		this.saturation.onChange(listener);
		this.hue.onChange(listener);
	}

	public onBrightnessChange(callback: (brightness: number) => void): void {
		this.brightness.onChange(callback);
	}
}
