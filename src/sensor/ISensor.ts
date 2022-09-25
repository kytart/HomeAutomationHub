import { DeviceType, IDevice } from "../device/IDevice";

export interface ISensor extends IDevice {
	onData(callback: (data: number) => void): void;
}

export function isOnOffDevice(device: IDevice): device is ISensor {
	return device.getType() === DeviceType.Sensor;
}
