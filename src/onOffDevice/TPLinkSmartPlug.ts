import * as tplink from 'tplink-smarthome-api';
import { DeviceType } from '../device/IDevice';
import { IOnOffDevice } from "./IOnOffDevice";

export class TPLinkSmartPlug implements IOnOffDevice {

	private client: tplink.Client;

	constructor(private ip: string) {
		this.client = new tplink.Client();
	}

	public getType(): DeviceType {
		return DeviceType.OnOffDevice;
	}

	public async setOn(): Promise<void> {
		await this.setPowerState(true);
	}

	public async setOff(): Promise<void> {
		await this.setPowerState(false);
	}

	public async isOn(): Promise<boolean> {
		const device = await this.getDevice();
		return await device.getPowerState();
	}

	private async setPowerState(powerState: boolean) {
		const device = await this.getDevice();
		await device.setPowerState(powerState);
	}

	private async getDevice() {
		const device = await this.client.getDevice({ host: this.ip });
		if (device.deviceType !== 'plug') {
			throw new Error('Device is not a plug');
		}
		return device;
	}
}
