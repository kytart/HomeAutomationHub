import * as hap from 'hap-nodejs';
import * as mqtt from 'async-mqtt';
import { InfluxDB } from 'influx';
import Debug from 'debug';
import config from './config/config'
import { Bridge } from './homekit/Bridge';
import { DeviceFactory } from './device/DeviceFactory';

const debug = Debug('HomeAutomationHub:server');

hap.HAPStorage.setCustomStoragePath(config.homekit.persistPath);

(async () => {
	const mqttClient = await mqtt.connectAsync(config.mqtt.uri)
	console.info('MQTT client connected');

	const influxdb = new InfluxDB({
		host: config.influxdb.host,
		database: config.influxdb.database,
	});

	const bridge = new Bridge("MC Home Bridge");

	const deviceFactory = new DeviceFactory({
		mqttClient,
		influxdb,
		appleHomekitBridge: bridge,
	});

	for (const deviceName of Object.keys(config.devices)) {
		const deviceConfig = config.devices[deviceName];
		debug('create device', {
			name: deviceName,
			config: deviceConfig,
		});

		// TODO do something with the device, right now it just starts working on its own and that's it
		const _device = deviceFactory.createDevice(deviceConfig);
	}

	bridge.publish();
	console.info("Bridge setup finished!");

	process.removeAllListeners('uncaughtException');
	process.on('uncaughtException', (error: any) => console.error(error && error.stack ? error.stack : error));
	process.on('unhandledRejection', (error: Error) => {
		throw error;
	});
})();
