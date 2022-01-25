import * as mqtt from 'async-mqtt';
import { Accessory } from './Accessory';
import { ThermostatService } from './service/ThermostatService';
import { MqttTemperatureSource } from './source/MqttTemperatureSource';
import config from '../config/config.json'
import { FakeHeater } from './device/FakeHeater';
import { Thermostat } from './Thermostat';
import { createTPLinkSmartPlugHeater } from './device/deviceFactory';

const accessory = new Accessory('kytart.home', 'MC Home');
const livingRoomThermostatService = new ThermostatService('Living Room Thermostat');

accessory.addService(livingRoomThermostatService);
accessory.publish();

console.info("Accessory setup finished!");

(async () => {
	const mqttClient = await mqtt.connectAsync('mqtt://rpi_home')
	console.info('MQTT client connected');

	const livingRoomMqttTopic = config.rooms.livingRoom.temperature.mqttTopic;
	const bedroomMqttTopic = config.rooms.bedroom.temperature.mqttTopic;

	await mqttClient.subscribe(livingRoomMqttTopic);
	await mqttClient.subscribe(bedroomMqttTopic);

	const livingRoomTempSrc = new MqttTemperatureSource(mqttClient, livingRoomMqttTopic);
	const livingRoomHeater = createTPLinkSmartPlugHeater(config.rooms.livingRoom.tpLinksmartPlug.ip);
	const livingRoomThermostat = new Thermostat('LivingRoom', livingRoomThermostatService, livingRoomTempSrc, livingRoomHeater);
	console.log('living room thermostat initialized');
})();
