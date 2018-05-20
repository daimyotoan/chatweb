import { Model } from './model';

export enum NotiType {
    Payment = 0,
    Report = 1,
    Book = 2,
    Message = 3
}

export class Noti extends Model {
    content: string;
    title: string;
    groupKey: string;
    userKey: string;
}
