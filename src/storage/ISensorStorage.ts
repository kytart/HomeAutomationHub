export interface ISensorStorage {
	storeReading(value: number): Promise<void>;
};
