import { NetworkService } from './network.service';
import { IToken, IReceivingUser, IHashUser, IErrorMessage, IGlobalError, IAuthConfig } from './../shared.interface';
import { eErrorTypes } from './../shared.constants';
import { Subject, Observable, Subscription } from 'rxjs/Rx';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthService {

	public userName: string;
	public storeNumber: number;

	private _authModule: FSDAuthentication;

	private _tokenSource = new Subject<boolean>();
	public tokenAvailable$ = this._tokenSource.asObservable();

	private _refreshSub: Subscription;

	constructor(private _networkService: NetworkService) { }

	public init(config: IAuthConfig, token?: string) {
		this._authModule = new FSDAuthentication(config, token);
		if (token !== undefined) {
			if (!this.expired) {
				this._tokenSource.next(true);
			} else {
				this.refreshAuth(this.storeNumber);
			}
		}

		console.log(this._authModule);

		this.startRefreshMonitor();
	}

	public authenticate(username: string, password: string, callback?: (err: Error) => void) {

		if (this._networkService.online) {
			this._authModule.authenticate(username, password, (err: Error) => {
				if (err) {
					this.checkAndHandleError(err);
					if (callback !== undefined) {
						callback(err);
						return;
					}
				}
				this.userName = username;
				this._tokenSource.next(true);

				if (callback !== undefined) {
					callback(undefined);
				}
			});
		} else {
			this._authModule.offlinePasswordCheck(username, password, (err: Error, result: boolean) => {
				if (err) {
					const errData = <IGlobalError>{
						errorType: eErrorTypes.eAuthenticationError,
						message: err.message
					};

					const error = new Error(JSON.stringify(errData));
					if (callback !== undefined) {
						callback(error);
					} else {
						throw error;
					}
				}

				if (result) {
					this.userName = username;
					if (callback !== undefined) {
						callback(undefined);
					}
				} else {
					const errData = <IGlobalError>{
						errorType: eErrorTypes.eAuthenticationError,
						message: 'Password Invalid'
					};

					const error = new Error(JSON.stringify(errData));
					if (callback !== undefined) {
						callback(error);
					} else {
						throw error;
					}
				}
			});
		}
	}

	public refreshAuth(storeNumber: number) {
		this._authModule.refreshToken(storeNumber, (err: Error) => {
			this.checkAndHandleError(err, eErrorTypes.eAuthenticationExpiredError);
			if (!err) {
				this._tokenSource.next(true);
			}
		});
	}

	public updateUserList(callback: (err: Error, result?: IHashUser[]) => void) {
		this._authModule.userList((err: Error, result?: IHashUser[]) => {
			if (err) {
				this.checkAndHandleError(err, eErrorTypes.eAuthenticationServiceError);
				callback(err);
				return;
			}

			this._authModule.userHashList = result;

			callback(undefined, result);
		});
	}

	public invalidateToken() {
		if (this._authModule !== undefined) {
			this._authModule.clearToken();
			this._tokenSource.next(false);
			this._refreshSub.unsubscribe();
			this.startRefreshMonitor();
		}
	}

	public get currentToken(): IToken {
		if (this._authModule !== undefined) {
			return this._authModule.token;
		}
	}

	public get currentUser(): IReceivingUser {
		return <IReceivingUser>{
			userName: this._authModule.access_token ? this._authModule.user_name : this.userName
		};
	}

	public get userList(): IHashUser[] {
		return this._authModule.userHashList;
	}

	public set userList(value: IHashUser[]) {
		this._authModule.userHashList = value;
	}

	public get expired(): boolean {
		return this._authModule.expired;
	}

	private startRefreshMonitor() {

		if (this._refreshSub) {
			this._refreshSub.unsubscribe();
		}

		this._refreshSub = Observable
			.interval(500)
			.skipUntil(this.tokenAvailable$)
			.subscribe(() => {
				if (this._authModule.expired) {
					console.log('Refreshing auth token');
					this._tokenSource.next(false);
					this.refreshAuth(this.storeNumber);

					this.startRefreshMonitor();
				}
			});
	}

	private checkAndHandleError(err, errorType?: number) {
		if (err) {
			console.warn('Authentication Service Error', err);
			let message;
			let errorMessage;
			try {
				message = JSON.parse(err.message);
			} catch (e) {
				errorMessage = err.message;
			}


			if (errorType === undefined) {
				switch (message.statusCode) {
					case 0:
						errorType = eErrorTypes.eAuthenticationServiceError;
						errorMessage = 'No connection to authentication service';
						break;
					case 401:
						errorType = eErrorTypes.eAuthenticationExpiredError;
						break;
					case 500:
						errorType = eErrorTypes.eAuthenticationError;
						errorMessage = 'Invalid username/password';
						break;
					default:
						errorType = eErrorTypes.eAuthenticationServiceError;
						errorMessage = message.serverResponse.error_description;
				}
			}

			const errData = <IGlobalError>{
				errorType: errorType,
				message: errorMessage
			};

			throw new Error(JSON.stringify(errData));
		}
	}

}
