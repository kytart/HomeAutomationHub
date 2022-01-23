import { Accessory } from './Accessory';
import { Thermostat } from './Thermostat';

const accessory = new Accessory('kytart.home', 'MC Home');
const livingRoomThermostat = new Thermostat('Living Room Thermostat');

accessory.addService(livingRoomThermostat);
accessory.publish();

console.info("Accessory setup finished!");
