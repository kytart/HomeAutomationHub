import * as hap from 'hap-nodejs';

export interface IService {
	getService(): hap.Service;
};
