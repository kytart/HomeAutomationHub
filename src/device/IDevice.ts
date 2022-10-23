export enum DeviceType {
	HumiditySensor,
	WindowSensor,
	Sensor,
	OnOffDevice,
	Light,
}

export interface IDevice {
	getType(): DeviceType;
}
