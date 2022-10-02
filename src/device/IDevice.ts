export enum DeviceType {
	HumiditySensor,
	Sensor,
	OnOffDevice,
}

export interface IDevice {
	getType(): DeviceType;
}
