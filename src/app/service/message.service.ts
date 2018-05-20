import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Rx';
import {BaseService} from './base.service';
import {Message} from '../models/Message';

@Injectable()
export class MessageService extends BaseService<Message> {

    messages$: Observable<Message[]>;

    constructor(afDb: AngularFireDatabase) {
        super(afDb, 'chat_messages');
    }

    list(childNode: string) {
        this.nodeName$ = 'chat_messages' + '/' + childNode;
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
        this.messages$ = this.models$;

        return this.messages$;
    }
}






















