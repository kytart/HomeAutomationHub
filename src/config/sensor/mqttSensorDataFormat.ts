import { z } from 'zod';

export enum MqttSensorDataFormatType {
	JSON = 'json',
}

export const MqttSensorDataFormatJSONSchema = z.strictObject({
	format: z.literal(MqttSensorDataFormatType.JSON),
	path: z.string().min(1, { message: 'JSON path can\'t be empty' }),
});
export type MqttSensorDataFormatJSON = z.infer<typeof MqttSensorDataFormatJSONSchema>;

// TODO change to union type once there's more types
export const MqttSensorDataFormatSchema = MqttSensorDataFormatJSONSchema;
export type MqttSensorDataFormat = z.infer<typeof MqttSensorDataFormatSchema>;

export function isMqttSensorDataFormatJSON(
	dataFormat: MqttSensorDataFormat
): dataFormat is MqttSensorDataFormatJSON {
	return dataFormat.format === MqttSensorDataFormatType.JSON;
}
