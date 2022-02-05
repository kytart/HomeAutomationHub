import Debug from 'debug';
import { ITemperatureSource } from "../source/ITemperatureSource";
import { ITemperatureStorage } from "./ITemperatureStorage";

const debug = Debug('HomeAutomationHub:TemperaturePersister');

export class TemperaturePersister {

	constructor(
		private temperatureSrc: ITemperatureSource,
		private temperatureStorage: ITemperatureStorage,
	) { }

	public start() {
		this.temperatureSrc.onTemperature(async (temperature: number) => {
			debug(`got temperature: ${temperature}, storing`);
			this.temperatureStorage.storeTemperature(temperature);
		});
	}
}
