import * as Influx from 'influx';
import Debug from 'debug';
import { Measurement } from '../influxdb/types';
import { ITemperatureStorage } from "./ITemperatureStorage";

const debug = Debug('HomeAutomationHub:InfluxDBTemperatureStorage');

export class InfluxDBTemperatureStorage implements ITemperatureStorage {

	constructor(
		private influxdb: Influx.InfluxDB,
		private tags: {
			[key: string]: string;
		},
	) { }

	public async storeTemperature(temperature: number): Promise<void> {
		debug('store temperature ' + temperature);
		const point = this.createPoint(temperature);
		await this.influxdb.writePoints([point]);
	}

	private createPoint(temperature: number): Influx.IPoint {
		return {
			measurement: Measurement.Temperature,
			fields: {
				value: temperature,
			},
			tags: this.tags,
		};
	}
}
