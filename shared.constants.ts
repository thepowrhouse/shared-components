export enum eErrorTypes {
	eGlobalError = 1, // global non-specific error
	eScanNotFound, // 404 - product not found
	eNetworkError, // no network error
	eServiceUnreachable, // network available, but API service not
	eServiceError, // server error (500 error)
	eAuthenticationError, // Invalid password (offline)
	eAuthenticationDenied, // User is not allowed to use application
	eAuthenticationExpiredError, // Refresh token expired
	eAuthenticationServiceError, // Authentication service exception
  eScannedItemNotFound, // Scanned Item not found (eScanNotFound returns Shipment info)
};

export const enum eUserRoles {
	eStoreSystemsRole,
	eShipperReceiverRole,
	eManagerRole,
	eAssociateRole
}
