export interface ITemperatureSource {
	onTemperature(callback: (temp: number) => void): void;
}
