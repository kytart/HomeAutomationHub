import * as hap from 'hap-nodejs';
import * as mqtt from 'async-mqtt';
import { InfluxDB } from 'influx';
import config, { IRoom as IRoomConfig } from '../config/config'
import { createThermostatAccessoryWithMQTTTempSensorAndTPLinkHeater } from './accessory/accessoryFactory';
import { Bridge } from './Bridge';
import { InfluxDBTemperatureStorage } from './storage/InfluxDBTemperatureStorage';
import { TemperaturePersister } from './storage/TemperaturePersister';

hap.HAPStorage.setCustomStoragePath(config.homekit.persistPath);

async function createRoom(
	config: IRoomConfig,
	mqttClient: mqtt.AsyncClient,
	influxdb: InfluxDB,
) {
	const thermostat = await createThermostatAccessoryWithMQTTTempSensorAndTPLinkHeater(mqttClient, config);

	const temperatureStorage = new InfluxDBTemperatureStorage(influxdb, config.temperature.influxdbTags);
	const temperaturePersister = new TemperaturePersister(thermostat.temperatureSrc, temperatureStorage);
	temperaturePersister.start();

	return {
		thermostat,
		temperaturePersister,
	};
}

(async () => {
	const mqttClient = await mqtt.connectAsync(config.mqtt.uri)
	console.info('MQTT client connected');

	const influxDB = new InfluxDB({
		host: config.influxdb.host,
		database: config.influxdb.database,
	});

	const bridge = new Bridge("MC Home Bridge");

	const livingRoom = await createRoom(config.rooms.livingRoom, mqttClient, influxDB);
	bridge.addAccessory(livingRoom.thermostat.accessory);
	console.log('living room initialized');

	const bedroom = await createRoom(config.rooms.bedroom, mqttClient, influxDB);
	bridge.addAccessory(bedroom.thermostat.accessory);
	console.log('bedroom initialized');

	bridge.publish();
	console.info("Bridge setup finished!");

	process.removeAllListeners('uncaughtException');
	process.on('uncaughtException', (error: any) => console.error(error && error.stack ? error.stack : error));
	process.on('unhandledRejection', (error: Error) => {
		throw error;
	});
})();
