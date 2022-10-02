import * as hap from 'hap-nodejs';
import * as qrcode from 'qrcode-terminal';
import { Accessory } from './accessory/Accessory';

export class Bridge {

	private username: string = "CC:22:3D:E3:CE:F6";
	private pincode: string = "031-45-154";
	private uuid: string;
	private bridge: hap.Bridge;

	constructor(name: string) {
		this.uuid = hap.uuid.generate(name);
		this.bridge = new hap.Bridge(name, this.uuid);
		this.init();
	}

	public addAccessory(accessory: Accessory) {
		this.bridge.addBridgedAccessory(accessory.getAccessory());
	}

	public publish() {
		this.bridge.publish({
			username: this.username,
			pincode: this.pincode,
			category: hap.Categories.OTHER,
		});
	}

	private init() {
		this.bridge.on(hap.AccessoryEventTypes.CHARACTERISTIC_WARNING, (warning: hap.CharacteristicWarning) => {
			console.warn('bridge warning', warning);
		});

		const info = this.bridge.getService(hap.Service.AccessoryInformation)!;
		info.setCharacteristic(hap.Characteristic.Manufacturer, "Kytart");
		info.setCharacteristic(hap.Characteristic.Model, "Bridge 9000");
		info.setCharacteristic(hap.Characteristic.SerialNumber, this.username);
		info.setCharacteristic(hap.Characteristic.FirmwareRevision, '1.0.0');

		this.bridge.on(hap.AccessoryEventTypes.LISTENING, (port: number) => {
			console.info("Bridge is listening on port " + port);

			console.log('Scan this code with your HomeKit app on your iOS device to pair with the bridge');
			qrcode.generate(this.bridge.setupURI());
			console.log('Or enter this code with your HomeKit app on your iOS device to pair with homekit2mqtt:');
			console.log('                       ');
			console.log('    ┌────────────┐     ');
			console.log('    │ ' + this.pincode + ' │     ');
			console.log('    └────────────┘     ');
			console.log('                       ');
			console.log('');
		});

		this.bridge.on(hap.AccessoryEventTypes.IDENTIFY, (paired, callback) => {
			console.log('bridge ' + (paired ? 'paired' : 'unpaired'));
			callback();
		});
	}
}
