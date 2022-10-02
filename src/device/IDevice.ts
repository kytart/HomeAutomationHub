export enum DeviceType {
	HumiditySensor,
	WindowSensor,
	Sensor,
	OnOffDevice,
}

export interface IDevice {
	getType(): DeviceType;
}
