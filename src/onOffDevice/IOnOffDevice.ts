import { DeviceType, IDevice } from "../device/IDevice";

export enum OnOffDeviceEvent {
	StatusChanged = 'status_changed',
}

export type StatusChangedListener = (powerOn: boolean) => void;

export interface IOnOffDevice extends IDevice {
	setOn(): Promise<void>;
	setOff(): Promise<void>;
	isOn(): Promise<boolean>;
	addListener(event: OnOffDeviceEvent.StatusChanged, listener: StatusChangedListener): void;
	removeListener(event: OnOffDeviceEvent.StatusChanged, listener: StatusChangedListener): void;
}

export function isOnOffDevice(device: IDevice): device is IOnOffDevice {
	return device.getType() === DeviceType.OnOffDevice;
}
