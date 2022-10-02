import * as Influx from 'influx';
import Debug from 'debug';
import { ISensorStorage, } from "./ISensorStorage";

const debug = Debug('HomeAutomationHub:InfluxDBSensorStorage');

export class InfluxDBSensorStorage<T> implements ISensorStorage<T> {

	constructor(
		private influxdb: Influx.InfluxDB,
		private measurement: string,
		private tags: {
			[key: string]: string;
		},
	) { }

	public async storeReading(value: T): Promise<void> {
		debug('store temperature ' + value);
		const point = this.createPoint(value);
		await this.influxdb.writePoints([point]);
	}

	private createPoint(temperature: T): Influx.IPoint {
		return {
			measurement: this.measurement,
			fields: {
				value: temperature,
			},
			tags: this.tags,
		};
	}
}
