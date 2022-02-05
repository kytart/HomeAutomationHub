import config from './config.json';

export interface IRoom {
	temperature: {
		mqttTopic: string;
		influxdbTags: {
			[key: string]: string;
		};
	};
	thermostat: {
		name: string;
		tpLinkSmartPlug: {
			ip: string;
		};
	};
}

export interface IConfig {
	mqtt: {
		uri: string;
	};
	influxdb: {
		host: string;
		database: string;
	};
	rooms: {
		[key: string]: IRoom;
	};
	homekit: {
		persistPath: string;
	},
}

export default config as IConfig;
