import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from './services/auth.service';
import { ToastContainerComponent } from './toast-container/toast-container.component';
import { ToasterService } from './services/toaster.service';
import { GlobalErrorHandler } from './error-handler';
import { ErrorService } from './services/error.service';
import { LoadingModalComponent } from './loading-modal/loading-modal.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { OptionSelectComponent } from './option-select/option-select.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { SortBarComponent } from './sort-bar/sort-bar.component';
import { AppButtonComponent } from './app-button/app-button.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { NetworkService } from './services/network.service';
import { ScannerService } from './services/scanner.service';
import { NgModule, ErrorHandler } from '@angular/core';

@NgModule({
	declarations: [
		AppHeaderComponent,
		AppFooterComponent,
		AppButtonComponent,
		SortBarComponent,
		TableHeaderComponent,
		OptionSelectComponent,
		ErrorModalComponent,
		LoadingModalComponent,
		ToastContainerComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
	],
	exports: [
		AppHeaderComponent,
		AppFooterComponent,
		AppButtonComponent,
		SortBarComponent,
		TableHeaderComponent,
		OptionSelectComponent,
		ErrorModalComponent,
		LoadingModalComponent,
		ToastContainerComponent
	],
	providers: [
		{ provide: ErrorHandler, useClass: GlobalErrorHandler },
		ToasterService,
		ScannerService,
		NetworkService,
		AuthService,
		ErrorService,
	]
})

export class FSDSharedModule { }
