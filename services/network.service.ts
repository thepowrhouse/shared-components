import { Observable, Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class NetworkService {

	private _loadingStream = new Subject<boolean>();
	public loadingSource$ = this._loadingStream.asObservable();

	public networkAvailable$ = Observable.merge(
		Observable.of(navigator.onLine),
		Observable.fromEvent(window, 'online').mapTo(true),
		Observable.fromEvent(window, 'offline').mapTo(false));

	private _online: boolean;

	constructor() {
		this._online = navigator.onLine;
		this.networkAvailable$.subscribe(online => {
			console.log('Online status change:', online);
			this._online = online
		});
	}

	public get online(): boolean {
		return this._online;
	}

	public set loading(value: boolean) {
		this._loadingStream.next(value);
	}

}
