import * as hap from 'hap-nodejs';
import '../service/IService';
import { IService } from '../service/IService';

export class Accessory {

	private uuid: string;
	private accessory: hap.Accessory;

	constructor(
		private name: string,
		private category: hap.Categories,
	) {
		this.uuid = hap.uuid.generate(name);
		this.accessory = new hap.Accessory(name, this.uuid);
		this.init();
	}

	public getAccessory() {
		return this.accessory;
	}

	public addService(service: IService) {
		this.accessory.addService(service.getService());
	}

	private init() {
		this.accessory.category = this.category;
		this.accessory.getService(hap.Service.AccessoryInformation)
			.setCharacteristic(hap.Characteristic.SerialNumber, "SN1234567")
			.setCharacteristic(hap.Characteristic.Manufacturer, "Kytart")
			.setCharacteristic(hap.Characteristic.FirmwareRevision, "1.0")
			.setCharacteristic(hap.Characteristic.Name, this.name)
	}
}
