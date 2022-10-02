import { DeviceType, IDevice } from "../device/IDevice";

export interface ISensor extends IDevice {
	getCurrent(): number;
	onData(callback: (data: number) => void): void;
}

export function isSensor(device: IDevice): device is ISensor {
	return device.getType() === DeviceType.Sensor;
}
