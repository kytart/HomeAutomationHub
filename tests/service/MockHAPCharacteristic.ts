import { EventEmitter } from 'events';
import * as hap from 'hap-nodejs';

export class MockHAPCharacteristic extends EventEmitter {

	public displayName: string = 'test';

	private value: hap.CharacteristicValue;

	constructor(
		defaultValue: hap.CharacteristicValue
	) {
		super();
		this.value = defaultValue;
	}

	public getValue() {
		return this.value;
	}

	public setValue(value: hap.CharacteristicValue) {
		this.value = value;
	}
}
