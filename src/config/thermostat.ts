import { z } from 'zod';
import { DeviceType } from './deviceType';
import { OnOffDeviceSchema } from './onOff';
import { SensorSchema } from './sensor/sensor';

export enum ThermostatType {
	AppleHomekit = 'apple-homekit',
}

export const AppleHomekitThermostatSchema = z.strictObject({
	type: z.literal(ThermostatType.AppleHomekit),
	name: z.string(),
	temperatureSensor: SensorSchema,
	// TODO change to union type once there's more types of devices
	heater: OnOffDeviceSchema,
});
export type AppleHomekitThermostat = z.infer<typeof AppleHomekitThermostatSchema>;

// TODO change to union type once there's more type
export const ThermostatSchema = AppleHomekitThermostatSchema;
export type Thermostat = z.infer<typeof ThermostatSchema>;

export function isAppleHomekitThermostat(thermostat: Thermostat): thermostat is AppleHomekitThermostat {
	return thermostat.type === ThermostatType.AppleHomekit;
}

export const ThermostatDeviceSchema = z.strictObject({
	type: z.literal(DeviceType.Thermostat),
	config: ThermostatSchema,
});
export type ThermostatDevice = z.infer<typeof ThermostatDeviceSchema>;
