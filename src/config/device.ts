import { z } from 'zod';
import { DeviceType } from './deviceType';
import {
	OnOffDevice,
	OnOffDeviceSchema,
} from './onOff';
import {
	HumiditySensorDevice,
	HumiditySensorDeviceSchema,
} from './sensor/humiditySensor';
import {
	WindowSensorDevice,
	WindowSensorDeviceSchema,
} from './sensor/windowSensor';
import {
} from './sensor/sensor';
import {
	ThermostatDevice,
	ThermostatDeviceSchema,
} from './thermostat';

export const DeviceSchema = z.discriminatedUnion("type", [
	HumiditySensorDeviceSchema,
	WindowSensorDeviceSchema,
	OnOffDeviceSchema,
	ThermostatDeviceSchema,
]);
export type Device = z.infer<typeof DeviceSchema>;

export function isHumiditySensorDevice(device: Device): device is HumiditySensorDevice {
	return device.type === DeviceType.HumiditySensor;
}

export function isWindowSensorDevice(device: Device): device is WindowSensorDevice {
	return device.type === DeviceType.WindowSensor;
}

export function isOnOffDevice(device: Device): device is OnOffDevice {
	return device.type === DeviceType.OnOffDevice;
}

export function isThermostatDevice(device: Device): device is ThermostatDevice {
	return device.type === DeviceType.Thermostat;
}
