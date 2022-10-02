import { z } from 'zod';
import { DeviceType } from '../deviceType';
import { SensorSchema } from './sensor';

export enum WindowSensorType {
	AppleHomekit = "apple-homekit",
}

export const AppleHomekitWindowSensorSchema = z.strictObject({
	type: z.literal(WindowSensorType.AppleHomekit),
	name: z.string(),
	sensor: SensorSchema,
});
export type AppleHomekitWindowSensor = z.infer<typeof AppleHomekitWindowSensorSchema>;

// TODO change to union type once there's more type
export const WindowSensorSchema = AppleHomekitWindowSensorSchema;
export type WindowSensor = z.infer<typeof WindowSensorSchema>;

export function isAppleHomekitWindowSensor(sensor: WindowSensor): sensor is AppleHomekitWindowSensor {
	return sensor.type === WindowSensorType.AppleHomekit;
}

export const WindowSensorDeviceSchema = z.strictObject({
	type: z.literal(DeviceType.WindowSensor),
	config: WindowSensorSchema,
});
export type WindowSensorDevice = z.infer<typeof WindowSensorDeviceSchema>;
