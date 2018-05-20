import {BaseService} from './base.service';
import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {DeviceToken} from '../models/device-token';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class DeviceTokensService extends BaseService<DeviceToken> {

    devices$: Observable<DeviceToken[]>;

    constructor(afDb: AngularFireDatabase) {
        super(afDb, 'device_tokens');
    }

    list(childNode: string) {
        this.nodeName$ = 'device_tokens' + '/' + childNode;
        console.log('node name: ' + this.nodeName$);
        this.ref$ = this.afDb$.database.ref(this.nodeName$);
        this.models$ = this.afDb$.list(this.nodeName$);
        this.models$ = this.listFromPaths([this.getNodeName()], {
            query: {
                orderByChild: 'timestamp',
                limitToLast: 20,
            }
        });

        this.startLoading();
        this.devices$ = this.models$;

        return this.devices$;
    }

}
