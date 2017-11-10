import { Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {

	private _globalAppErrorSource = new Subject<Error>();
	public showApplicationError$ = this._globalAppErrorSource.asObservable();

	private _genericErrorSource = new Subject<Error>();
	public showGenericError$ = this._genericErrorSource.asObservable();

	constructor() { }

	public logGenericError(error: Error) {
		this._genericErrorSource.next(error);
	}

	public logError(error: Error) {
		this._globalAppErrorSource.next(error);
	}
}
