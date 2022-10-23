import * as Influx from 'influx';
import * as mqtt from 'async-mqtt';
import {
	Device as DeviceConfig,
	isHumiditySensorDevice,
	isLightDevice,
	isOnOffDevice,
	isThermostatDevice,
	isWindowSensorDevice,
} from '../config/device';
import { OnOffDeviceFactory } from '../onOffDevice/OnOffDeviceFactory';
import { StorageFactory } from '../storage/StorageFactory';
import { ThermostatFactory } from '../thermostat/ThermostatFactory';
import { Bridge } from '../homekit/Bridge';
import { HumiditySensorFactory } from '../sensor/humiditySensor/HumiditySensorFactory';
import { WindowSensorFactory } from '../sensor/windowSensor/WindowSensorFactory';
import { IDevice } from './IDevice';
import { SensorFactory } from '../sensor/SensorFactory';
import { LightFactory } from '../light/LightFactory';

export interface DeviceFactoryProps {
	influxdb: Influx.InfluxDB;
	mqttClient: mqtt.AsyncClient;
	appleHomekitBridge: Bridge;
}

export class DeviceFactory {

	private storageFactory: StorageFactory;
	private sensorFactory: SensorFactory;
	private humiditySensorFactory: HumiditySensorFactory;
	private windowSensorFactory: WindowSensorFactory;
	private onOffDeviceFactory: OnOffDeviceFactory;
	private thermostatFactory: ThermostatFactory;
	private lightFactory: LightFactory;

	constructor({ influxdb, mqttClient, appleHomekitBridge }: DeviceFactoryProps) {
		this.storageFactory = new StorageFactory(influxdb);
		this.sensorFactory = new SensorFactory(mqttClient, this.storageFactory);
		this.humiditySensorFactory = new HumiditySensorFactory(appleHomekitBridge, this.sensorFactory);
		this.windowSensorFactory = new WindowSensorFactory(appleHomekitBridge, this.sensorFactory);
		this.onOffDeviceFactory = new OnOffDeviceFactory();
		this.thermostatFactory = new ThermostatFactory(appleHomekitBridge, this.sensorFactory, this.onOffDeviceFactory);
		this.lightFactory = new LightFactory(appleHomekitBridge);
	}

	public createDevice(config: DeviceConfig): IDevice {
		if (isHumiditySensorDevice(config)) {
			return this.humiditySensorFactory.createHumiditySensor(config.config);
		} else if (isWindowSensorDevice(config)) {
			return this.windowSensorFactory.createWindowSensor(config.config);
		} else if (isOnOffDevice(config)) {
			return this.onOffDeviceFactory.createOnOffDevice(config.config);
		} else if (isThermostatDevice(config)) {
			return this.thermostatFactory.createThermostat(config.config);
		} else if (isLightDevice(config)) {
			return this.lightFactory.createLight(config.config);
		} else {
			throw new Error(`invalid device config ${JSON.stringify(config)}`);
		}
	}
}
