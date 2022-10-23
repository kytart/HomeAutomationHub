import { HSLColor } from "../../color/color";
import { IService } from "./IService";

export interface ILightService extends IService {
	isOn(): boolean;
	turnOn(): void;
	turnOff(): void;
	getColor(): HSLColor;
	setColor(color: HSLColor): void;
	getBrightness(): number;
	setBrightness(brightness: number): void;
	onPowerChange(callback: (on: boolean) => void): void;
	onColorChange(callback: (color: HSLColor) => void): void;
	onBrightnessChange(callback: (brightness: number) => void): void;
}
