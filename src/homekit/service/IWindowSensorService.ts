import { IService } from "./IService";

export interface IWindowSensorService extends IService {
	isOpen(): boolean;
	setOpen(isOpen: boolean): void;
	onChange(callback: (isOpen: boolean) => void): void;
}
