export interface ITemperatureStorage {
	storeTemperature(temperature: number): Promise<void>;
};
