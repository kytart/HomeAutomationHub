import should from 'should';
import sinon from 'sinon';
import * as hap from 'hap-nodejs';
import { Characteristic } from '../../src/service/Characteristic';
import { MockHAPCharacteristic } from './MockHAPCharacteristic';

function createMockService(characteristic: any): hap.Service {
	return {
		displayName: 'test',
		getCharacteristic() {
			return characteristic;
		}
	} as unknown as hap.Service;
}

describe('Service.Characteristic', () => {

	describe('getValue', () => {

		it('should return default value', () => {
			const hapCharacteristic = new MockHAPCharacteristic(1);
			const service = createMockService(hapCharacteristic);
			const characteristic = new Characteristic<number>(service, null as any, 1);

			const value = characteristic.getValue();
			should(value).equal(1);
		});

		it('should return value received from the server via SET event', () => {
			const hapCharacteristic = new MockHAPCharacteristic(1);
			const service = createMockService(hapCharacteristic);
			const characteristic = new Characteristic<number>(service, null as any, 1);

			const callback = sinon.spy();
			hapCharacteristic.emit(hap.CharacteristicEventTypes.SET, 2, callback);
			should(callback.callCount).equal(1);

			const value = characteristic.getValue();
			should(value).equal(2);
		});
	});

	describe('setValue', () => {

		it('should set value internally so that getValue returns it', () => {
			const hapCharacteristic = new MockHAPCharacteristic(1);
			const service = createMockService(hapCharacteristic);
			const characteristic = new Characteristic<number>(service, null as any, 1);

			characteristic.setValue(3);

			const value = characteristic.getValue();
			should(value).equal(3);
		});

		it('should set the value to the underlying hap characteristic', () => {
			const hapCharacteristic = new MockHAPCharacteristic(1);
			const service = createMockService(hapCharacteristic);
			const characteristic = new Characteristic<number>(service, null as any, 1);

			characteristic.setValue(3);

			const value = hapCharacteristic.getValue();
			should(value).equal(3);
		});
	});

	describe('onChange', () => {

		it('should call the provided callback when server emits new value via SET event', () => {
			const hapCharacteristic = new MockHAPCharacteristic(1);
			const service = createMockService(hapCharacteristic);
			const characteristic = new Characteristic<number>(service, null as any, 1);

			const listener = sinon.spy();
			characteristic.onChange(listener);

			const serverCallback = sinon.spy();
			hapCharacteristic.emit(hap.CharacteristicEventTypes.SET, 2, serverCallback);
			should(serverCallback.callCount).equal(1);
			should(listener.callCount).equal(1);
		});
	});
});
