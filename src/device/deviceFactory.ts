import { TPLinkSmartPlug } from "../tplink/TPLinkSmartPlug";
import { SMartPlugHeater } from "./SmartPlugHeater";

export function createTPLinkSmartPlugHeater(ip: string) {
	const smartPlug = new TPLinkSmartPlug(ip);
	return new SMartPlugHeater(smartPlug);
}
