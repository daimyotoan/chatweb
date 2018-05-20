import { Model } from './model';

export class DeviceToken extends Model {
    deviceid: string;
    os: string;
    ownerEmail: string;
    timestamp: number;
    ownerUid: string;
    token: string;
}
