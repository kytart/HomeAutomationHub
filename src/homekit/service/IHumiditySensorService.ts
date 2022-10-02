import { IService } from "./IService";

export interface IHumiditySensorService extends IService {
	getValue(): number;
	setValue(value: number): void;
	onChange(callback: (value: number) => void): void;
}
