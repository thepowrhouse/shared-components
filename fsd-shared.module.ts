import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from './services/auth.service';
import { ToasterService } from './services/toaster.service';
import { GlobalErrorHandler } from './error-handler';
import { ErrorService } from './services/error.service';
import { OptionSelectComponent } from './option-select/option-select.component';
import { NetworkService } from './services/network.service';
import { NgModule, ErrorHandler } from '@angular/core';

@NgModule({
	declarations: [
		OptionSelectComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
	],
	exports: [
		OptionSelectComponent
	],
	providers: [
		{ provide: ErrorHandler, useClass: GlobalErrorHandler },
		ToasterService,
		NetworkService,
		AuthService,
		ErrorService,
	]
})

export class FSDSharedModule { }
