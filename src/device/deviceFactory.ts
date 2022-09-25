import * as Influx from 'influx';
import * as mqtt from 'async-mqtt';
import { Device as DeviceConfig, isOnOffDevice, isSensorDevice, isThermostatDevice } from '../config/device';
import { OnOffDeviceFactory } from '../onOffDevice/OnOffDeviceFactory';
import { SensorFactory } from '../sensor/sensorFactory';
import { StorageFactory } from '../storage/StorageFactory';
import { IDevice } from './IDevice';
import { ThermostatFactory } from '../thermostat/ThermostatFactory';
import { Bridge } from '../Bridge';

export interface DeviceFactoryProps {
	influxdb: Influx.InfluxDB;
	mqttClient: mqtt.AsyncClient;
	appleHomekitBridge: Bridge;
}

export class DeviceFactory {

	private storageFactory: StorageFactory;
	private sensorFactory: SensorFactory;
	private onOffDeviceFactory: OnOffDeviceFactory;
	private thermostatFactory: ThermostatFactory;

	constructor({ influxdb, mqttClient, appleHomekitBridge }: DeviceFactoryProps) {
		this.storageFactory = new StorageFactory(influxdb);
		this.sensorFactory = new SensorFactory(mqttClient, this.storageFactory);
		this.onOffDeviceFactory = new OnOffDeviceFactory();
		this.thermostatFactory = new ThermostatFactory(appleHomekitBridge, this.sensorFactory, this.onOffDeviceFactory);
	}

	public createDevice(config: DeviceConfig): IDevice {
		if (isSensorDevice(config)) {
			return this.sensorFactory.createSensor(config.config);
		} else if (isOnOffDevice(config)) {
			return this.onOffDeviceFactory.createOnOffDevice(config.config);
		} else if (isThermostatDevice(config)) {
			return this.thermostatFactory.createThermostat(config.config);
		} else {
			throw new Error(`invalid device config ${JSON.stringify(config)}`);
		}
	}
}
