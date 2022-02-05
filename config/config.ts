import config from './config.json';

export interface IRoom {
	thermostat: {
		name: string;
		temperature: {
			mqttTopic: string;
		};
		tpLinkSmartPlug: {
			ip: string;
		};
	};
}

export interface IConfig {
	mqtt: {
		uri: string;
	};
	rooms: {
		[key: string]: IRoom;
	};
	homekit: {
		persistPath: string;
	},
}

export default config as IConfig;
