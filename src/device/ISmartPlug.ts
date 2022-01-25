export interface ISmartPlug {
	setOn(): Promise<void>;
	setOff(): Promise<void>;
	isOn(): Promise<boolean>;
}
