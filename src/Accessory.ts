import * as hap from 'hap-nodejs';
import './service/IService';
import { IService } from './service/IService';

export class Accessory {

	private uuid: string;
	private accessory: hap.Accessory;

	constructor(uid: string, name: string) {
		this.uuid = hap.uuid.generate(uid);
		this.accessory = new hap.Accessory(name, this.uuid);
	}

	public addService(service: IService) {
		this.accessory.addService(service.getService());
	}

	public publish() {
		this.accessory.publish({
			username: "17:51:07:F4:BC:8A",
			pincode: "678-90-876",
			port: 47129,
			category: hap.Categories.BRIDGE,
		});
	}
}
