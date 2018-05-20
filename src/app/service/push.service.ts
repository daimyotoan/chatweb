import {Injectable} from '@angular/core';
import {Noti} from '../models/noti';
import {Headers, Http} from '@angular/http';
import {DeviceTokensService} from './device-token.service';
import {DeviceToken} from '../models/device-token';
import {environment} from '../../environments/environment';

@Injectable()
export class PushService {

    constructor(public http: Http,
                public deviceTokensService: DeviceTokensService) {

    }

    send(noti: Noti) {
        this.deviceTokensService.list(noti.userKey).subscribe(devices => {
            console.log('devices', devices);
            const deviceTokens = devices;
            if (deviceTokens) {
                this.sendWithDeviceTokens(noti, deviceTokens);
            }
        });
    }

    private sendWithDeviceTokens(noti: Noti, deviceTokens: DeviceToken[]) {
        const body = {
            notification: {
                title: noti.title,
                content: noti.content,
                sound: 'default',
                badge: '0'
            },
            title: noti.title,
            content: noti.content,
            priority: 'high',
            registration_ids: deviceTokens.map(dt => dt.token),
            data: noti,
        };
        console.log('sendWithDeviceTokens', body);

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', environment.firebase.serverKey);

        this.http.post(
            'https://fcm.googleapis.com/fcm/send',
            body,
            {
                headers: headers
            })
            .subscribe(data => {
                console.log('[PushService] send() > success', data);
            }, error => {
                console.error('[PushService] send() > error', error);
            });
    }

}
