import { z } from 'zod';
import { MqttSensorDataFormatSchema } from './mqttSensorDataFormat';
import { PersistanceSchema } from './persistance';

export enum SensorType {
	Mqtt = 'mqtt',
}

export const BaseSensorSchema = z.strictObject({
	persistance: PersistanceSchema.optional(),
});

export const MqttSensorSchema = BaseSensorSchema.extend({
	type: z.literal(SensorType.Mqtt),
	topic: z.string(),
	format: MqttSensorDataFormatSchema,
}).strict();
export type MqttSensor = z.infer<typeof MqttSensorSchema>;

// TODO change to union type once there's more types of devices
export const SensorSchema = MqttSensorSchema;
export type Sensor = z.infer<typeof SensorSchema>;

export function isMqttSensor(sensor: Sensor): sensor is MqttSensor {
	return sensor.type === SensorType.Mqtt;
}
