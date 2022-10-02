import * as hap from 'hap-nodejs';
import { Characteristic } from './Characteristic';
import { IWindowSensorService } from './IWindowSensorService';

enum WindowState {
	Stopped = 2,
}

enum WindowPosition {
	Open = 100,
	Closed = 0,
}

const DEFAULT_STATE = WindowState.Stopped;
const DEFAULT_POSITION = WindowPosition.Closed;

export class WindowSensorService implements IWindowSensorService {

	private service: hap.Service;

	private state: Characteristic<number>;
	private targetPosition: Characteristic<number>;
	private currentPosition: Characteristic<number>;

	constructor(name: string) {
		this.service = new hap.Service.Window(name);
		this.state = new Characteristic(this.service, hap.Characteristic.PositionState, DEFAULT_STATE);
		this.currentPosition = new Characteristic(this.service, hap.Characteristic.CurrentPosition, DEFAULT_POSITION);
		this.targetPosition = new Characteristic(this.service, hap.Characteristic.TargetPosition, DEFAULT_POSITION);
	}

	public getService(): hap.Service {
		return this.service;
	}

	public isOpen(): boolean {
		const state = this.currentPosition.getValue();
		return state === WindowPosition.Open;
	}

	public setOpen(isOpen: boolean): void {
		const state = isOpen ? WindowPosition.Open : WindowPosition.Closed;
		this.currentPosition.setValue(state);
		this.targetPosition.setValue(state);
	}

	public onChange(callback: (isOpen: boolean) => void): void {
		this.currentPosition.onChange((state: WindowPosition) => {
			const isOpen = state === WindowPosition.Open;
			callback(isOpen);
		});
	}
}
