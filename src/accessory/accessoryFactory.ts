import * as hap from "hap-nodejs";
import * as mqtt from 'async-mqtt';
import { ThermostatService } from "../service/ThermostatService";
import { MqttTemperatureSource } from "../source/MqttTemperatureSource";
import { createTPLinkSmartPlugHeater } from "../device/deviceFactory";
import { Thermostat } from "../Thermostat";
import { Accessory } from "./Accessory";

export async function createThermostatAccessoryWithMQTTTempSensorAndTPLinkHeater(
	mqttClient: mqtt.AsyncClient,
	name: string,
	tempMqttTopic: string,
	tpLinkSmartPlugIp: string,
) {
	await mqttClient.subscribe(tempMqttTopic);

	const thermostatService = new ThermostatService(`${name} Thermostat`);
	const temperatureSrc = new MqttTemperatureSource(mqttClient, tempMqttTopic);
	const heater = createTPLinkSmartPlugHeater(tpLinkSmartPlugIp);
	const thermostat = new Thermostat(name, thermostatService, temperatureSrc, heater);

	const accessory = new Accessory(name, hap.Categories.THERMOSTAT);
	accessory.addService(thermostatService);

	return {
		accessory,
		thermostat,
	};
}
