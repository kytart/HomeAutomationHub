import { DeviceType, IDevice } from "../device/IDevice";

export interface IOnOffDevice extends IDevice {
	setOn(): Promise<void>;
	setOff(): Promise<void>;
	isOn(): Promise<boolean>;
}

export function isOnOffDevice(device: IDevice): device is IOnOffDevice {
	return device.getType() === DeviceType.OnOffDevice;
}
