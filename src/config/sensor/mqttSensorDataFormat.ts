import { z } from 'zod';

export enum MqttSensorDataFormatType {
	Number = 'number',
	JSON = 'json',
}

export const MqttSensorDataFormatNumberSchema = z.strictObject({
	format: z.literal(MqttSensorDataFormatType.Number),
});
export type MqttSensorDataFormatNumber = z.infer<typeof MqttSensorDataFormatNumberSchema>;

export const MqttSensorDataFormatJSONSchema = z.strictObject({
	format: z.literal(MqttSensorDataFormatType.JSON),
	path: z.string().min(1, { message: 'JSON path can\'t be empty' }),
});
export type MqttSensorDataFormatJSON = z.infer<typeof MqttSensorDataFormatJSONSchema>;

export const MqttSensorDataFormatSchema = z.discriminatedUnion("format", [
	MqttSensorDataFormatNumberSchema,
	MqttSensorDataFormatJSONSchema,
]);
export type MqttSensorDataFormat = z.infer<typeof MqttSensorDataFormatSchema>;

export function isMqttSensorDataFormatNumber(
	dataFormat: MqttSensorDataFormat
): dataFormat is MqttSensorDataFormatNumber {
	return dataFormat.format === MqttSensorDataFormatType.Number;
}

export function isMqttSensorDataFormatJSON(
	dataFormat: MqttSensorDataFormat
): dataFormat is MqttSensorDataFormatJSON {
	return dataFormat.format === MqttSensorDataFormatType.JSON;
}
