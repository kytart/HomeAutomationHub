import * as hap from 'hap-nodejs';
import { EventEmitter } from 'events';
import { removeWhiteSpaces } from '../../util/string';
import { createDebug } from '../../debug/debug';

enum Events {
	Change = 'change',
}

export class Characteristic<T extends hap.CharacteristicValue> {

	private currentValue: T;
	private characteristic: hap.Characteristic;
	private emitter: EventEmitter;
	private debug: ReturnType<typeof createDebug>;

	constructor(
		private service: hap.Service,
		characteristicConstructor: hap.WithUUID<{
			new(): hap.Characteristic;
		}>,
		defaultValue: T,
	) {
		this.currentValue = defaultValue;
		this.characteristic = this.service.getCharacteristic(characteristicConstructor);
		this.emitter = new EventEmitter();
		this.debug = createDebug(this.getDebugNamespace());
		this.init();
	}

	public getValue() {
		return this.currentValue;
	}

	public setValue(value: T) {
		this.currentValue = value;
		this.characteristic.setValue(value);
	}

	public onChange(callback: (value: T) => void) {
		this.emitter.on(Events.Change, callback);
	}

	private init() {
		this.characteristic.on(hap.CharacteristicEventTypes.GET, callback => {
			this.debug('GET', this.currentValue);
			callback(undefined, this.currentValue);
		});

		this.characteristic.on(hap.CharacteristicEventTypes.SET, (value, callback) => {
			this.debug('SET', value);
			this.currentValue = <T>value;
			callback();
			this.emitter.emit(Events.Change, this.currentValue);
		});
	}

	private getDebugNamespace() {
		const serviceName = removeWhiteSpaces(this.service.displayName);
		const characteristicName = removeWhiteSpaces(this.characteristic.displayName);
		return `Characteristic:${serviceName}:${characteristicName}`;
	}
}
