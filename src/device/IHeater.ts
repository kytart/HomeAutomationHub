export interface IHeater {
	setOn(): Promise<void>;
	setOff(): Promise<void>;
	isOn(): Promise<boolean>;
}
