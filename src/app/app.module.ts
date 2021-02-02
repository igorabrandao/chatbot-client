import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModules } from './app-routing.modules';
import { Ng2Webstorage } from 'ngx-webstorage';
import { ReactiveFormsModule } from '@angular/forms';

import { UserService } from './core/api/user/user.service';
import { BootService } from './core/api/chatbot/chatbot.service';

import { AuthClientHelper } from './core/helpers/auth/auth-client.helper';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TruncatePipe } from './core/pipes/truncate/truncate.pipe';
import { NgUploaderModule } from 'ngx-uploader';
import { ImageHelper } from './core/helpers/image/image.helper';
import { SpinnerHelper } from './core/helpers/spinner/spinner.helper';
import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
import { HttpClientModule } from '@angular/common/http';
import { ResourceModule } from '@ngx-resource/handler-ngx-http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PhpTimeToJsDatePipe } from './core/pipes/phpTimeToJsDate/php-time-to-js-date.pipe';
import { IConfig, NgxMaskModule } from 'ngx-mask';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};


registerLocaleData(localePT);

@NgModule({
    declarations: [
        TruncatePipe,
        /** Components **/
        AppComponent,
        PhpTimeToJsDatePipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        Ng2Webstorage.forRoot({
            prefix: 'WebFarma'
        }),
        ReactiveFormsModule,
        HttpClientModule,
        NgxDatatableModule,
        NgUploaderModule,
        ResourceModule.forRoot(),
        /** Routes **/
        AppRoutingModules,
        NgxMaskModule.forRoot(options)
    ],
    providers: [
        UserService,
        BootService,
        AuthClientHelper,
        ImageHelper,
        SpinnerHelper,
        { provide: LOCALE_ID, useValue: 'pt' },
        // {provide: HTTP_INTERCEPTORS, useClass: AuthClientHelper, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
