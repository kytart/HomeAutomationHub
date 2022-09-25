import * as Influx from 'influx';
import Debug from 'debug';
import { ISensorStorage, } from "./ISensorStorage";

const debug = Debug('HomeAutomationHub:InfluxDBSensorStorage');

export class InfluxDBSensorStorage implements ISensorStorage {

	constructor(
		private influxdb: Influx.InfluxDB,
		private measurement: string,
		private tags: {
			[key: string]: string;
		},
	) { }

	public async storeReading(value: number): Promise<void> {
		debug('store temperature ' + value);
		const point = this.createPoint(value);
		await this.influxdb.writePoints([point]);
	}

	private createPoint(temperature: number): Influx.IPoint {
		return {
			measurement: this.measurement,
			fields: {
				value: temperature,
			},
			tags: this.tags,
		};
	}
}
