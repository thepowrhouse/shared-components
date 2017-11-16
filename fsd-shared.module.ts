import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {AuthService} from "./services/auth.service";
import {ToasterService} from "./services/toaster.service";
import {GlobalErrorHandler} from "./error-handler";
import {ErrorService} from "./services/error.service";
import {OptionSelectComponent} from "./option-select/option-select.component";
import {NetworkService} from "./services/network.service";
import {NgModule, ErrorHandler} from "@angular/core";
import {LoginComponent} from "./login/login.component";
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [
        OptionSelectComponent,
        HeaderComponent,
        FooterComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        CommonModule,
        FormsModule,
        NgbModule.forRoot()
    ],
    exports: [
        OptionSelectComponent,
        HeaderComponent,
        FooterComponent,
        CommonModule,
        FormsModule,
    ],
    providers: [
        {provide: ErrorHandler, useClass: GlobalErrorHandler},
        ToasterService,
        NetworkService,
        AuthService,
        ErrorService
    ],
    entryComponents: [
        LoginComponent
    ]
})

export class FSDSharedModule {
}
