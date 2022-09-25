import { isTPLinkSmartPlug, OnOff as OnOffDeviceConfig } from '../config/onOff';
import { IOnOffDevice } from './IOnOffDevice';
import { TPLinkSmartPlug } from './TPLinkSmartPlug';


export class OnOffDeviceFactory {

	constructor() { }

	public createOnOffDevice(config: OnOffDeviceConfig): IOnOffDevice {
		if (isTPLinkSmartPlug(config)) {
			return new TPLinkSmartPlug(config.ip);
		} else {
			throw new Error(`invalid onOffDevice config ${JSON.stringify(config)}`);
		}
	}
}
