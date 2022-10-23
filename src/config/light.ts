import { z } from 'zod';
import { DeviceType } from './deviceType';

export enum LightType {
	MagicHome = 'magic-home',
	AppleHomekit = 'apple-homekit',
}

export const MagicHomeLightSchema = z.strictObject({
	type: z.literal(LightType.MagicHome),
	ip: z.string(),
});
export type MagicHomeLight = z.infer<typeof MagicHomeLightSchema>;

export const AppleHomekitLightSchema = z.strictObject({
	type: z.literal(LightType.AppleHomekit),
	name: z.string(),
	// TODO change to union type once there's more types
	device: MagicHomeLightSchema,
});
export type AppleHomekitLight = z.infer<typeof AppleHomekitLightSchema>;

export const LightSchema = z.union([MagicHomeLightSchema, AppleHomekitLightSchema]);
export type Light = z.infer<typeof LightSchema>;

export function isMagicHomeLight(light: Light): light is MagicHomeLight {
	return light.type === LightType.MagicHome;
}

export function isAppleHomekitLight(light: Light): light is AppleHomekitLight {
	return light.type === LightType.AppleHomekit;
}

export const LightDeviceSchema = z.strictObject({
	type: z.literal(DeviceType.Light),
	config: LightSchema,
});
export type LightDevice = z.infer<typeof LightDeviceSchema>;
