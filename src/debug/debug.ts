import Debug from 'debug';

const ROOT_NAMESPACE = 'HomeAutomationHub';

export function createDebug(namespace: string) {
	return Debug(`${ROOT_NAMESPACE}:${namespace}`);
}
