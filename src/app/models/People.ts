import {Model} from './Model';

export class People extends Model {
    fullname: string;
    lastMessage: string;
    urlPhoto: string;
    timestamp: number;
}
