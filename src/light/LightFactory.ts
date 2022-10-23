import * as hap from "hap-nodejs";
import { Bridge } from '../homekit/Bridge';
import { Accessory } from '../homekit/accessory/Accessory';
import { createDebug } from "../debug/debug";
import {
	isAppleHomekitLight,
	isMagicHomeLight,
	Light as LightConfig,
	AppleHomekitLight as AppleHomekitLightConfig,
	MagicHomeLight as MagicHomeLightConfig,
} from '../config/light';
import { ILight } from './ILight';
import { LightService } from '../homekit/service/LightService';
import { AppleHomekitLight } from "./AppleHomekitLight";
import { MagicHomeLight } from "./MagicHomeLight";

const debug = createDebug('LightFactory');

export class LightFactory {
	constructor(private appleHomekitBridge: Bridge) { }

	public createLight(config: LightConfig): ILight {
		if (isAppleHomekitLight(config)) {
			debug('create Apple Homekit light', config);
			return this.createAppleHomekitLight(config);
		} else if (isMagicHomeLight(config)) {
			debug('create Magic Home light', config);
			return this.createMagicHomeLight(config);
		} else {
			throw new Error(`invalid light config ${JSON.stringify(config)}`);
		}
	}

	private createAppleHomekitLight(config: AppleHomekitLightConfig) {
		const service = new LightService(config.name);
		const device = this.createLight(config.device);

		const accessory = new Accessory(config.name, hap.Categories.WINDOW);
		accessory.addService(service);
		this.appleHomekitBridge.addAccessory(accessory);

		return new AppleHomekitLight(service, device);
	}

	private createMagicHomeLight(config: MagicHomeLightConfig) {
		return new MagicHomeLight(config.ip);
	}
}
