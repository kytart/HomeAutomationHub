import * as Influx from 'influx';
import { isInfluxDBPersistance, Persistance as PersistanceConfig } from '../config/sensor/persistance';
import { InfluxDBSensorStorage } from './InfluxDBSensorStorage';
import { ISensorStorage } from './ISensorStorage';

export class StorageFactory {

	constructor(
		private influxdb: Influx.InfluxDB,
	) { }

	public createSensorStorage<T>(config: PersistanceConfig): ISensorStorage<T> {
		if (isInfluxDBPersistance(config)) {
			return new InfluxDBSensorStorage(this.influxdb, config.measurement, config.tags);
		} else {
			throw new Error(`invalid persistance config ${JSON.stringify(config)}`);
		}
	}
}
