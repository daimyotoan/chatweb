import {Model} from './Model';

export class Message extends Model {
    groupKey: string;
    text: string;
    photoUrl: string;
    avatarUrl: string;
    timestamp: number;
    type: number;
    uid: string;
}
