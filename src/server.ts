import * as hap from 'hap-nodejs';
import * as mqtt from 'async-mqtt';
import config, { IRoom as IRoomConfig } from '../config/config'
import { createThermostatAccessoryWithMQTTTempSensorAndTPLinkHeater } from './accessory/accessoryFactory';
import { Bridge } from './Bridge';

hap.HAPStorage.setCustomStoragePath(config.homekit.persistPath);

async function createRoom(
	config: IRoomConfig,
	mqttClient: mqtt.AsyncClient,
) {
	const thermostat = await createThermostatAccessoryWithMQTTTempSensorAndTPLinkHeater(
		mqttClient,
		config.thermostat.name,
		config.thermostat.temperature.mqttTopic,
		config.thermostat.tpLinkSmartPlug.ip,
	);

	return { thermostat };
}

(async () => {
	const mqttClient = await mqtt.connectAsync(config.mqtt.uri)
	console.info('MQTT client connected');

	const bridge = new Bridge("MC Home Bridge");

	const livingRoom = await createRoom(config.rooms.livingRoom, mqttClient);
	bridge.addAccessory(livingRoom.thermostat.accessory);
	console.log('living room initialized');

	const bedroom = await createRoom(config.rooms.bedroom, mqttClient);
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
