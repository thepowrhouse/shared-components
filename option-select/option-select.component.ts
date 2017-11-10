import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'option-select',
	templateUrl: './option-select.component.html',
	styleUrls: ['./option-select.component.css']
})
export class OptionSelectComponent implements OnInit {

	@Input() options: Array<string>;

	@Input() visible = false;
	@Output() visibleChange = new EventEmitter<boolean>();

	@Output() onSelection = new EventEmitter<string>();

	constructor() { }

	ngOnInit() {
	}

	public selection(data: string) {
		this.onSelection.emit(data);
		this.dismiss();
	}

	public dismiss() {
		this.visible = false;
		this.visibleChange.emit(this.visible);
	}

}
