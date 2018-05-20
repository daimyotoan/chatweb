import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

// components
import {AppComponent} from './app.component';

// modules
import {FirebaseModule} from './core/firebase';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {HeaderComponent} from './header/header.component';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {PeoplesComponent} from './peoples/peoples.component';
import {MessagesComponent} from './messages/messages.component';
import {SpinnerModule} from '@chevtek/angular-spinners/dist';
import {AuthService} from './auth.service';
import {PeoplesService} from './service/peoples.service';
import {BaseService} from './service/base.service';
import {MessageService} from './service/message.service';
import {AppRoutingModule} from './app-routing.module';
import {PeoplesRoutesModule} from './peoples/peoples.route';
import {MessagesRoutesModule} from './messages/messages.route';
import {FormsModule} from '@angular/forms';
import {DeviceTokensService} from './service/device-token.service';
import {PushService} from './service/push.service';
import {HttpModule} from '@angular/http';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    providers: [AuthService, PeoplesService, BaseService, MessageService, DeviceTokensService, PushService],
    declarations: [
        AppComponent,
        HeaderComponent,
        PeoplesComponent,
        MessagesComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([], {useHash: false}),
        AngularFireModule.initializeApp(environment.firebase),
        AngularMultiSelectModule,
        SpinnerModule,
        FirebaseModule,
        AppRoutingModule,
        HttpModule,
        PeoplesRoutesModule,
        MessagesRoutesModule,
        FormsModule
    ]
})
export class AppModule {
}
