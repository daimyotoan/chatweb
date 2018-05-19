import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Rx';
import * as async from 'async';
import * as _ from 'lodash';
import {People} from '../models/People';
import {BaseService} from './base.service';

@Injectable()
export class PeoplesService extends BaseService<People> {

    peoples$: Observable<People[]>;

    constructor(afDb: AngularFireDatabase) {
        super(afDb, 'chat_groups');
    }

    list() {
        this.models$ = this.listFromPaths([this.getNodeName()], { query: {
                orderByChild: 'timestamp'
            }});

        this.startLoading();
        this.peoples$ = this.models$;

        return this.peoples$;
    }
}






















