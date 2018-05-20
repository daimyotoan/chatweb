import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SpinnerService} from '@chevtek/angular-spinners/dist';
import {MessageService} from '../service/message.service';
import {PeoplesService} from '../service/peoples.service';
import {Message} from '../models/Message';
import {People} from '../models/People';
import * as firebase from 'firebase';
import {PushService} from '../service/push.service';
import {Noti} from '../models/noti';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

    messages: Message[] = [];
    messagesSubscription: any;
    groupKey: string;
    textMessage: string;
    supportUid = '68C1aJlVLDWwOKJorirlm9AVomT2';

    constructor(public route: ActivatedRoute,
                public spinnerService: SpinnerService,
                public messageService: MessageService,
                public pushService: PushService,
                public peopleService: PeoplesService) {
    }

    ngOnInit() {
        this.messageService.isLoading$.subscribe(isLoading => {
            if (isLoading) {
                this.spinnerService.show('AppRoom');
            } else {
                this.spinnerService.hide('AppRoom');
            }
        });

        this.route
            .queryParams
            .subscribe(params => {
                this.groupKey = params['groupKey'];
                if (this.groupKey) {
                    console.log('groupKey: ' + this.groupKey);
                    this.getMessagesFromService(this.groupKey);
                }
            });
    }

    getMessagesFromService(groupKey: string) {
        console.log('Loading messages for: ' + groupKey);
        this.messagesSubscription = this.messageService.list(groupKey).subscribe(messages => {
            console.log('loadMessages', messages);
            this.messages = [];
            this.messages = messages;
            // sort descending timestamp
            this.messages.sort(function (a, b) {
                return b.timestamp - a.timestamp
            });

            // display every message
            this.messages.forEach(message => {
                this.displayMessage(message);
            });
        });
    }

    displayMessage(message: Message) {
        firebase.database().ref('/firebase_users/' + message.uid).once('value', (function (snapshot) {
            const fullname = (snapshot.val() && snapshot.val().fullname);
            const uid = (snapshot.val() && snapshot.val().uid);
            const urlPhoto = (snapshot.val() && snapshot.val().urlPhoto);
            message.avatarUrl = urlPhoto;
            message.name = fullname;
        }).bind(this));
    }

    saveMessage() {
        // push message to chat_messages
        if (!this.groupKey)
            return;

        const m = new Message();
        m.text = this.textMessage;
        m.uid = this.supportUid;
        m.groupKey = this.groupKey;
        m.type = 1;
        m.timestamp = new Date().getTime();
        this.messageService.push(m);

        // update last message
        const p = new People();
        p.lastMessage = this.textMessage;
        p.timestamp = new Date().getTime();
        p.key = this.groupKey;
        this.peopleService.update(p);

        // send noti
        this.sendNoti();

        this.textMessage = '';
    }

    sendNoti() {
        if (!this.groupKey)
            return;

        const res = this.groupKey.split('_');
        let selUid = res[0];
        if (res[0] === this.supportUid) {
            selUid = res[1];
        }

        const noti = new Noti();
        noti.title = 'Sale Management';
        noti.content = this.textMessage;
        noti.groupKey = this.groupKey;
        noti.userKey = selUid;
        console.log('text' + noti.content);
        this.pushService.send(noti);
    }
}
