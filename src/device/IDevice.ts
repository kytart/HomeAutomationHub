export enum DeviceType {
	Sensor,
	OnOffDevice,
}

export interface IDevice {
	getType(): DeviceType;
}
