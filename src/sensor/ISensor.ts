import { DeviceType, IDevice } from "../device/IDevice";

export interface ISensor<T> extends IDevice {
	getCurrent(): T;
	onData(callback: (data: T) => void): void;
}
