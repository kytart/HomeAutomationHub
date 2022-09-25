import { z } from 'zod';
import { DeviceType } from './deviceType';
import {
	OnOffDevice,
	OnOffDeviceSchema,
} from './onOff';
import {
	SensorDevice,
	SensorDeviceSchema,
} from './sensor/sensor';
import {
	ThermostatDevice,
	ThermostatDeviceSchema,
} from './thermostat';

export const DeviceSchema = z.discriminatedUnion("type", [
	SensorDeviceSchema,
	OnOffDeviceSchema,
	ThermostatDeviceSchema,
]);
export type Device = z.infer<typeof DeviceSchema>;

export function isSensorDevice(device: Device): device is SensorDevice {
	return device.type === DeviceType.Sensor;
}

export function isOnOffDevice(device: Device): device is OnOffDevice {
	return device.type === DeviceType.OnOffDevice;
}

export function isThermostatDevice(device: Device): device is ThermostatDevice {
	return device.type === DeviceType.Thermostat;
}
