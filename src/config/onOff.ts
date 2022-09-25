import { z } from 'zod';
import { DeviceType } from './deviceType';

export enum OnOffDeviceType {
	TPLink = 'tplink-smart-plug',
}

export const TPLinkSmartPlugSchema = z.strictObject({
	type: z.literal(OnOffDeviceType.TPLink),
	ip: z.string(),
});
export type TPLinkSmartPlug = z.infer<typeof TPLinkSmartPlugSchema>;

// TODO change to union once there's more types
export const OnOffSchema = TPLinkSmartPlugSchema;
export type OnOff = z.infer<typeof OnOffSchema>;

export function isTPLinkSmartPlug(onOff: OnOff): onOff is TPLinkSmartPlug {
	return onOff.type === OnOffDeviceType.TPLink;
}

export const OnOffDeviceSchema = z.strictObject({
	type: z.literal(DeviceType.OnOffDevice),
	config: OnOffSchema,
});
export type OnOffDevice = z.infer<typeof OnOffDeviceSchema>;
