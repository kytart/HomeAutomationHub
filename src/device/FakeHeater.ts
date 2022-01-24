import { IHeater } from "./IHeater";

export class FakeHeater implements IHeater {

	private on: boolean = false;

	public async setOn(): Promise<void> {
		this.on = true;
		console.info('Heater set to ON');
	}
	public async setOff(): Promise<void> {
		this.on = false;
		console.info('Heater set to OFF');
	}
	public async isOn(): Promise<boolean> {
		return this.on;
	}
}
