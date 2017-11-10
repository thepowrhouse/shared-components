export interface IDeviceConfig {
	storeNumber: string;
	banner: string;
	environment: string;
	authenticationConfig: IAuthenticationConfig;
	inventoryLookupConfig: IInventoryLookupConfig;
	receivingConfig: IReceivingConfig;
	shippingConfig: IShippingConfig;
	signageTicketingConfig: ISignageTicketingConfig;
	inventoryCountConfig: IInventoryCountConfig;
}

export interface IAuthenticationConfig {
	clientid: string;
	secretcode: string;
	serviceUrl: string;
}

export interface IInventoryLookupConfig {
	hostUrl: string;
	defaultSearchRadius: number;
}

export interface IReceivingConfig {
	serviceUrl: string;
}

export interface IShippingConfig {
	hostUrl: string;
}

export interface ISignageTicketingConfig {
	hostUrl: string;
}

export interface IInventoryCountConfig {
	serviceUrl: string;
}

export interface ISortValues {
	label1: string;
	value1: string;
	label2: string;
	value2: string;
}

export interface ISortEvent {
	sortValue: string;
	sortAsc: boolean;
}

export interface IErrorMessage {
	message: string;
	status: number;
}

export interface IGlobalError {
	errorType: number;
	message: any;
	scanData?: string | number;
}

export interface IToken {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
}

export interface IAuthConfig {
	hostURL: string;
	clientId: string;
	clientSecret: string;
}

export interface IReceivingUser {
	userName: string;
}

export interface IHashUser {
	operatorId: number,
	accessPassword: string;
	groupId: number
}
