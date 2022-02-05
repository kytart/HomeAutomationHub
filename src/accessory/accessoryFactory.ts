import * as hap from "hap-nodejs";
import * as mqtt from 'async-mqtt';
import { ThermostatService } from "../service/ThermostatService";
import { MqttTemperatureSource } from "../source/MqttTemperatureSource";
import { createTPLinkSmartPlugHeater } from "../device/deviceFactory";
import { Thermostat } from "../Thermostat";
import { Accessory } from "./Accessory";
import { IRoom } from "../../config/config";

export async function createThermostatAccessoryWithMQTTTempSensorAndTPLinkHeater(
	mqttClient: mqtt.AsyncClient,
	config: IRoom,
) {
	await mqttClient.subscribe(config.temperature.mqttTopic);

	const thermostatService = new ThermostatService(config.thermostat.name);
	const temperatureSrc = new MqttTemperatureSource(mqttClient, config.temperature.mqttTopic);
	const heater = createTPLinkSmartPlugHeater(config.thermostat.tpLinkSmartPlug.ip);
	const thermostat = new Thermostat(config.thermostat.name, thermostatService, temperatureSrc, heater);

	const accessory = new Accessory(config.thermostat.name, hap.Categories.THERMOSTAT);
	accessory.addService(thermostatService);

	return {
		accessory,
		thermostat,
		temperatureSrc,
	};
}
