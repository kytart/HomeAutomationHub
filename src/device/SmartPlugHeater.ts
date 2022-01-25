import { IHeater } from "./IHeater";
import { ISmartPlug } from "./ISmartPlug";

export class SMartPlugHeater implements IHeater {

	constructor(private smartPlug: ISmartPlug) { }

	public setOn(): Promise<void> {
		return this.smartPlug.setOn();
	}

	public setOff(): Promise<void> {
		return this.smartPlug.setOff();
	}

	public isOn(): Promise<boolean> {
		return this.smartPlug.isOn();
	}
}
