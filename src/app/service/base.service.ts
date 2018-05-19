import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { firebase } from '../core/firebase';
import { IModel, Model } from '../models/Model';
import { PartialObserver } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import Reference = firebase.database.Reference;
import { FirebaseListFactoryOpts } from 'angularfire2/interfaces';


@Injectable()
export class BaseService<T extends Model> {

    afDb$: AngularFireDatabase;
    ref$: Reference;
    subscription$: any;
    subscriber$: PartialObserver<Object>;
    isLoading$ = new Subject();

    nodeName$: string;
    models$: FirebaseListObservable<T[]>;

    constructor(afDb: AngularFireDatabase, nodeName: string) {
        this.afDb$ = afDb;
        this.nodeName$ = nodeName;
        this.ref$ = afDb.database.ref(this.nodeName$);
        this.models$ = afDb.list(this.nodeName$);
    }

    subscribe(sub) {
        this.subscriber$ = sub;
    }

    push(model: T): firebase.Promise<any> {
        if (!model.key) {
            model.key = this.models$.$ref.ref.push().key;
        }
        return this.models$.$ref.ref.child(model.key).set(model);
    }

    remove(model: T): firebase.Promise<any> {
        return this.models$.remove(this.getKeyFromModel(model));
    }

    update(model: T): firebase.Promise<any> {
        return this.models$.update(this.getKeyFromModel(model), model);
    }

    getKeyFromModel(model: T): string {
        return model.$key ? model.$key : model.key;
    }

    getNodeName(): string {
        return this.nodeName$;
    }

    startLoading() {
        this.isLoading$.next(true);
    }

    stopLoading() {
        this.isLoading$.next(false);
    }

    createPaths(paths: [string]) {
        let result = '';
        paths.forEach(path => {
           result += `${path}/`;
        });
        return result;
    }

    objectFromPaths(paths: [string]): FirebaseObjectObservable<T> {
        return this.afDb$.object(this.createPaths(paths));
    }

    listFromPaths(paths: [string], opts: FirebaseListFactoryOpts): FirebaseListObservable<T[]> {
        if (opts === undefined) {
            return this.afDb$.list(this.createPaths(paths));
        }
        return this.afDb$.list(this.createPaths(paths), opts);
    }
}
