import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MessagesComponent} from './messages.component';
import {MessageService} from '../service/message.service';

export const MessagesRoutesModule: ModuleWithProviders = RouterModule.forChild([
    {
        path: 'messages',
        component: MessagesComponent,
    }
]);
