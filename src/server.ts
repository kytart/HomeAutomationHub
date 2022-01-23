import * as mqtt from 'async-mqtt';
import { Accessory } from './Accessory';
import { Thermostat } from './service/ThermostatService';
import { MqttTemperatureSource } from './source/MqttTemperatureSource';
import config from '../config/config.json'

const accessory = new Accessory('kytart.home', 'MC Home');
const livingRoomThermostat = new Thermostat('Living Room Thermostat');

accessory.addService(livingRoomThermostat);
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
	livingRoomTempSrc.onTemperature((temp: number) => {
		livingRoomThermostat.setCurrentTemp(temp);
	});
})();
