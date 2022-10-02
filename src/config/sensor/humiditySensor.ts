import { z } from 'zod';
import { DeviceType } from '../deviceType';
import { SensorSchema } from './sensor';

export enum HumiditySensorType {
	AppleHomekit = "apple-homekit",
}

export const AppleHomekitHumiditySensorSchema = z.strictObject({
	type: z.literal(HumiditySensorType.AppleHomekit),
	name: z.string(),
	sensor: SensorSchema,
});
export type AppleHomekitHumiditySensor = z.infer<typeof AppleHomekitHumiditySensorSchema>;

// TODO change to union type once there's more type
export const HumiditySensorSchema = AppleHomekitHumiditySensorSchema;
export type HumiditySensor = z.infer<typeof HumiditySensorSchema>;

export function isAppleHomekitHumiditySensor(sensor: HumiditySensor): sensor is AppleHomekitHumiditySensor {
	return sensor.type === HumiditySensorType.AppleHomekit;
}

export const HumiditySensorDeviceSchema = z.strictObject({
	type: z.literal(DeviceType.HumiditySensor),
	config: HumiditySensorSchema,
});
export type HumiditySensorDevice = z.infer<typeof HumiditySensorDeviceSchema>;
