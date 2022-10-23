import { RGBColor } from "../color/color";
import { IDevice } from "../device/IDevice";

export interface ILight extends IDevice {
	turnOn(): Promise<void>;
	turnOff(): Promise<void>;
	isOn(): Promise<boolean>;
	getColor(): Promise<RGBColor>;
	setColor(color: RGBColor): Promise<void>;
	getBrightness(): Promise<number>;
	setBrightness(brightness: number): Promise<void>;
}
