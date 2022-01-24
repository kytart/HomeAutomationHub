import { IHeater } from '../src/device/IHeater';

export class MockHeater implements IHeater {

	private on: boolean = false;

	public async setOn(): Promise<void> {
		this.on = true;
	}

	public async setOff(): Promise<void> {
		this.on = false;
	}

	public async isOn(): Promise<boolean> {
		return this.on;
	}
}
