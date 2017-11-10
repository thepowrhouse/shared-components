import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface IToast {
	title: string;
	message: string | number;
	notice?: boolean
}

export const enum eToastTypes {
	eStandard = 0,
	eNotice
}

export const TOAST_TIME = 5000;

@Injectable()
export class ToasterService {

	private _toast = new Subject<IToast>();
	public toastSource$ = this._toast.asObservable();

	constructor() { }

	public sendToast(title: string, message: string | number, notice?: boolean) {
		this._toast.next({ title, message, notice });
	}

	clearToast() {
		this._toast.next();
	}

}
