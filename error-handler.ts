import { environment } from './../../environments/environment';
import { ErrorService } from './services/error.service';

import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

	constructor(private _errorService: ErrorService) { }

	handleError(error) {
		console.log('Caught the error', error);

		this._errorService.logError(error);

		if (!environment.production) {
			console.log('Re-throwing the error in dev. This won\'t happen in production/pre-prod');
			throw error;
		}
	}
}
