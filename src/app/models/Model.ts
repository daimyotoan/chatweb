import { firebase } from '../core/firebase';

export interface IModel {
    $key?: string;
    key: string;
    timestamp: Object;
    name: string;
}

export class Model implements IModel {
    timestamp = firebase.database.ServerValue.TIMESTAMP;
    $key;
    key;
    title;
    name;
}
