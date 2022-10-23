import EventEmitter from 'events';
import * as tplink from 'tplink-smarthome-api';
import { AnyDevice } from 'tplink-smarthome-api/lib/client';
import { DeviceType } from '../device/IDevice';
import { IOnOffDevice, OnOffDeviceEvent, StatusChangedListener } from "./IOnOffDevice";
import { createDebug } from '../debug/debug';

const debug = createDebug('onOffDevice:TPLinkSmartPlug');

function isDevicePlug(device: AnyDevice): device is tplink.Plug {
	return device.deviceType === 'plug';
}

export class TPLinkSmartPlug implements IOnOffDevice {

	private emitter: EventEmitter = new EventEmitter();
	private client: tplink.Client;
	private lastPowerStatus: boolean = false;

	constructor(private ip: string) {
		this.client = new tplink.Client({ logLevel: 'silent' });
		this.init();
	}

	public getType(): DeviceType {
		return DeviceType.OnOffDevice;
	}

	public async setOn(): Promise<void> {
		await this.setPowerState(true);
		this.lastPowerStatus = true;
	}

	public async setOff(): Promise<void> {
		await this.setPowerState(false);
		this.lastPowerStatus = false;
	}

	public async isOn(): Promise<boolean> {
		return this.lastPowerStatus;
	}

	public addListener(event: OnOffDeviceEvent, listener: StatusChangedListener): void {
		this.emitter.addListener(event, listener);
	}

	public removeListener(event: OnOffDeviceEvent, listener: StatusChangedListener): void {
		this.emitter.removeListener(event, listener);
	}

	private async setPowerState(powerState: boolean) {
		const device = await this.getDevice();
		await device.setPowerState(powerState);
	}

	private async getDevice(): Promise<tplink.Plug> {
		const device = await this.client.getDevice({ host: this.ip });
		if (!isDevicePlug(device)) {
			throw new Error('Device is not a plug');
		}
		return device;
	}

	private init() {
		this.checkPowerStatus();
		setInterval(this.checkPowerStatus.bind(this), 5e3);
	}

	private async checkPowerStatus() {
		try {
			const device = await this.getDevice();
			const powerOn = await device.getPowerState();

			if (powerOn !== this.lastPowerStatus) {
				debug('power update, powerOn=' + powerOn);
				this.lastPowerStatus = powerOn;
				this.emitter.emit(OnOffDeviceEvent.StatusChanged, powerOn);
			}
		} catch (error) {
			debug('error: ' + error.message);
		}
	}
}
