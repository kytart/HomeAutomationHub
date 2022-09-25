import { z } from 'zod';
import Debug from 'debug';
import appRoot from 'app-root-path';
import { DeviceSchema } from './device';
import { join } from 'path';

const debug = Debug('HomeAutomationHub:config');

const configPath = join(appRoot.toString(), 'config/config.json');
const config = require(configPath);

debug(config);

export const ConfigSchema = z.strictObject({
	mqtt: z.strictObject({
		uri: z.string(),
	}),
	influxdb: z.strictObject({
		host: z.string(),
		database: z.string(),
	}),
	homekit: z.strictObject({
		persistPath: z.string(),
	}),
	devices: z.record(DeviceSchema),
});

export default ConfigSchema.parse(config);
