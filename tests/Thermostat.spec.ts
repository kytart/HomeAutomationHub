import should from 'should';
import { MockThermostatService } from './MockThermostatService';
import { MockTemperatureSource } from './MockTemperatureSource';
import { MockHeater } from './MockHeater';
import { Thermostat } from '../src/Thermostat';

describe('Thermostat', () => {

	describe('on new temperature from source', () => {

		const testCases = [
			{ targetTemp: 20, newTemp: 15, expectedState: true },
			{ targetTemp: 20, newTemp: 22, expectedState: false },
			{ targetTemp: 20, newTemp: 20, expectedState: false },
		];

		for (const testCase of testCases) {
			const { targetTemp, newTemp, expectedState } = testCase;
			it(`should turn ${expectedState ? 'on' : 'off'}`, async () => {
				const service = new MockThermostatService();
				const tempSource = new MockTemperatureSource();
				const heater = new MockHeater();
				const thermostat = new Thermostat('test', service, tempSource, heater);

				await heater.setOff();
				service.setTargetTemp(targetTemp);
				tempSource.emitTemperature(newTemp);

				const heaterState = await heater.isOn();
				should(heaterState).equal(expectedState);
			});
		}
	});

	describe('on target temperature change', () => {

		const testCases = [
			{ currentTemp: 15, newTargetTemp: 20, expectedState: true },
			{ currentTemp: 22, newTargetTemp: 20, expectedState: false },
			{ currentTemp: 20, newTargetTemp: 20, expectedState: false },
		];

		for (const testCase of testCases) {
			const { currentTemp, newTargetTemp, expectedState } = testCase;
			it(`should turn ${expectedState ? 'on' : 'off'}`, async () => {
				const service = new MockThermostatService();
				const tempSource = new MockTemperatureSource();
				const heater = new MockHeater();
				const thermostat = new Thermostat('test', service, tempSource, heater);

				await heater.setOff();
				service.setCurrentTemp(currentTemp);
				service.setTargetTemp(newTargetTemp);

				const heaterState = await heater.isOn();
				should(heaterState).equal(expectedState);
			});
		}
	});
});
