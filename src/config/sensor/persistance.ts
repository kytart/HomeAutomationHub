import { z } from 'zod';

export enum Measurement {
	Temperature = 'temperature',
}

export enum PersistanceType {
	InfluxDB = 'influxdb',
}

export const InfluxDBPersistanceSchema = z.strictObject({
	type: z.literal(PersistanceType.InfluxDB),
	measurement: z.nativeEnum(Measurement),
	tags: z.object({}).passthrough(),
});
export type InfluxDBPersistance = z.infer<typeof InfluxDBPersistanceSchema>;

// TODO change to union type once there's more types
export const PersistanceSchema = InfluxDBPersistanceSchema;
export type Persistance = z.infer<typeof PersistanceSchema>;

export function isInfluxDBPersistance(persistance: Persistance): persistance is InfluxDBPersistance {
	return persistance.type === PersistanceType.InfluxDB;
}
