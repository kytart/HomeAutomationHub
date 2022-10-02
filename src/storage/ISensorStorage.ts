export interface ISensorStorage<T> {
	storeReading(value: T): Promise<void>;
};
